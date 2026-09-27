import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SCHEMES_DATABASE } from './src/data/schemesData.ts';
import { matchStudentWithSchemes, evaluateStrictEligibility } from './src/utils/matchingEngine.ts';
import { StudentProfile, GuidanceRequest, Scheme } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Data Store (Stores real student guidance requests submitted through the app)
let guidanceRequests: GuidanceRequest[] = [];

// Profile store
const studentProfiles: Record<string, StudentProfile> = {};

// --------------------------------------------------------------------
// API ROUTES
// --------------------------------------------------------------------

// 1. Get all schemes (52 General + 7 Hardware)
app.get('/api/schemes', (req: Request, res: Response) => {
  const { category, type, search } = req.query;
  let results = [...SCHEMES_DATABASE];

  if (type === 'hardware') {
    results = results.filter((s) => s.hardware_delivered !== null);
  } else if (type === 'general') {
    results = results.filter((s) => s.hardware_delivered === null);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((s) =>
      s.target_audience.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.benefit_details.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    schemes: results
  });
});

// 2. Strict Criteria-Based Scheme Matching
app.post('/api/schemes/match', (req: Request, res: Response) => {
  const profile: StudentProfile = req.body;

  if (!profile || !profile.category || profile.annualFamilyIncome === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Invalid profile data. Category and Annual Family Income are mandatory.'
    });
  }

  // Strictly filter: student is ONLY shown schemes for which they meet ALL criteria
  const matchedEvaluations = matchStudentWithSchemes(profile, SCHEMES_DATABASE);

  res.json({
    success: true,
    matchedCount: matchedEvaluations.length,
    matches: matchedEvaluations
  });
});

// 3. Teacher Guidance Request Inbox
app.get('/api/teacher/requests', (req: Request, res: Response) => {
  const { status, category, schemeId, search } = req.query;
  let results = [...guidanceRequests];

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter((r) => r.status === status);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(
      (r) => r.student_category.toUpperCase() === category.toUpperCase()
    );
  }

  if (schemeId && typeof schemeId === 'string' && schemeId !== 'all') {
    results = results.filter((r) => r.scheme_id === schemeId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.student_name.toLowerCase().includes(q) ||
        r.student_id.toLowerCase().includes(q) ||
        r.scheme_title.toLowerCase().includes(q) ||
        r.request_message.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    requests: results
  });
});

// 4. Update Request Status (Approve, Reject, Request Re-upload)
app.patch('/api/teacher/requests/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, teacher_notes, reviewer_id } = req.body;

  const requestIndex = guidanceRequests.findIndex((r) => r.id === id);
  if (requestIndex === -1) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  const existing = guidanceRequests[requestIndex];
  const updated: GuidanceRequest = {
    ...existing,
    status: status || existing.status,
    teacher_notes: teacher_notes !== undefined ? teacher_notes : existing.teacher_notes,
    reviewed_by: reviewer_id || 'user-teacher-1',
    reviewed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  guidanceRequests[requestIndex] = updated;

  res.json({
    success: true,
    message: `Request status updated to ${updated.status}`,
    request: updated
  });
});

// 5. Submit Guidance Request by Student
app.post('/api/guidance/requests', (req: Request, res: Response) => {
  const { student, scheme, message } = req.body;

  if (!student || !scheme) {
    return res.status(400).json({ success: false, message: 'Student and scheme are required' });
  }

  // Perform strict automated compliance check
  const evaluation = evaluateStrictEligibility(student, scheme);

  const newRequest: GuidanceRequest = {
    id: `req-${Date.now()}`,
    student_id: student.id || `student-${Math.floor(Math.random() * 1000)}`,
    student_name: student.name || 'Anonymous Student',
    student_category: student.category || 'OPEN',
    student_income: student.annualFamilyIncome || 0,
    student_class: student.standardYear || student.educationLevel || 'Class 12',
    student_stream: student.stream || 'Science',
    student_percentage: student.percentage || 75,
    scheme_id: scheme.id,
    scheme_title: scheme.title,
    scheme_department: scheme.department,
    scheme_benefit: scheme.benefit_details,
    hardware_delivered: scheme.hardware_delivered,
    request_type: 'scheme_application',
    request_message: message || 'Requesting verification and guidance.',
    attached_documents: scheme.required_documents || [],
    status: 'pending',
    strict_compliance_check: evaluation.isEligible,
    compliance_details: {
      all_criteria_met: evaluation.isEligible,
      failure_reasons: evaluation.failureReasons
    },
    teacher_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  guidanceRequests.unshift(newRequest);

  res.json({
    success: true,
    message: 'Guidance request submitted to Teacher Dashboard',
    request: newRequest
  });
});

// 6. Student Profile persistence
app.get('/api/student/profile/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const p = studentProfiles[id];
  res.json({ success: true, profile: p || null, profileCompleted: Boolean(p) });
});

app.put('/api/student/profile/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { profile } = req.body;
  if (profile) {
    studentProfiles[id] = profile;
  }
  res.json({ success: true, profile: studentProfiles[id] });
});

// --------------------------------------------------------------------
// FRONTEND SERVING / VITE INTEGRATION
// --------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[YOGYATA SERVER] Running on port ${PORT}`);
    console.log(`[YOGYATA SERVER] Schemes Master Directory Loaded (General & Hardware)`);
    console.log(`[YOGYATA SERVER] Teacher Guidance Dashboard & Strict Matching Engine Active`);
  });
}

startServer();
