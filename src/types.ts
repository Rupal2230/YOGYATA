export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'student' | 'teacher' | 'counsellor' | 'institution' | 'system_admin';

export interface DocumentInfo {
  id: string;
  name: string;
  description: string;
  issuingAuthority: string;
  portalLink?: string;
  tag: string;
}

export interface Scheme {
  id: string;
  title: string;
  scheme_name: string;
  department: string;
  level: string; // Education level
  target_audience: string; // Target category/audience e.g., OPEN, EWS, SC, ST, VJNT, OBC, SBC, PwD, Minority
  income_limit: number | null; // Numeric ceiling, null if no limit
  income_limit_text: string; // Formatted text e.g. "≤ ₹8,00,000 / Year"
  min_academic_percentage: number; // Cutoff e.g. 60.0
  benefit_details: string; // Text benefit description
  deadline: string; // ISO date string e.g. "2026-11-30"
  required_documents: string[]; // Document codes e.g. ["AADHAAR", "DOMICILE_MH", "INCOME_CERT"]
  portal_url: string; // Official application URL
  online_sop: string; // Step-by-step online procedure
  offline_sop: string; // Step-by-step offline verification procedure
  hardware_delivered: string | null; // e.g. "4G/5G Tablet + Daily SIM Internet Data" or null
  requires_hostel?: boolean;
  requires_marginal_farmer?: boolean;
  requires_cap_allotment?: boolean;
  requires_disability?: boolean;
  gender_restriction?: 'all' | 'female' | 'male';
  stream_restriction?: string; // 'all' | 'Science' | 'Engineering' | 'Medical' | 'Fine Arts' | 'Agriculture' | 'Veterinary' | 'ITI'
  scheme_category?: 'general' | 'hardware_device' | 'merit_scholarship' | 'hostel_stipend' | 'overseas' | 'special_concession';
  status: 'active' | 'expired' | 'draft';
}

export interface StudentProfile {
  name: string;
  age: number;
  dob: string;
  gender: 'male' | 'female' | 'other';
  educationLevel: string; // e.g., 'Secondary (Class 9-10)', 'Junior College (11th-12th)', 'Undergraduate', 'Postgraduate', 'PhD', 'ITI', 'Medical', 'Engineering', 'Fine Arts', 'Agriculture'
  standardYear: string; // e.g., '11th Standard', 'B.Tech 1st Year'
  stream: string; // 'Science', 'Arts', 'Commerce', 'Engineering', 'Medical', 'Fine Arts', 'Agriculture', 'Veterinary', 'General'
  state: string;
  district: string;
  isMaharashtraDomicile: boolean;
  category: string; // 'OPEN', 'EWS', 'SC', 'ST', 'VJNT', 'OBC', 'SBC', 'Minority', 'SEBC'
  annualFamilyIncome: number; // in Rupees
  annualIncomeRange?: string;
  percentage: number; // Academic score in qualifying examination
  hostelResident: boolean; // Hosteller vs Day Scholar
  marginalFarmerChild: boolean; // 7/12 Land extract
  exServicemanWard: boolean; // Ward of Armed Forces / Ex-Servicemen
  isOrphan: boolean;
  hasDisability: boolean;
  disabilityPercentage?: number;
  bocwWorkerChild?: boolean;
  capAllotmentAdmitted?: boolean;
  firstGenerationLearner?: boolean;
  orphanOrSingleParent?: boolean;
  documentAvailability: Record<string, boolean>; // {"AADHAAR": true, "DOMICILE_MH": true, ...}
}

export interface CriteriaCheck {
  passed: boolean;
  label: string;
  userValue: string;
  requiredValue: string;
  note?: string;
}

export interface StrictMatchEvaluation {
  scheme: Scheme;
  isEligible: boolean;
  criteriaChecks: {
    category: CriteriaCheck;
    income: CriteriaCheck;
    educationLevel: CriteriaCheck;
    stream: CriteriaCheck;
    academicPercentage: CriteriaCheck;
    hostel: CriteriaCheck;
    marginalFarmer: CriteriaCheck;
    disability: CriteriaCheck;
    gender: CriteriaCheck;
    domicile: CriteriaCheck;
    capAdmission: CriteriaCheck;
  };
  failureReasons: string[];
}

export interface GuidanceRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_category: string;
  student_income: number;
  student_class: string;
  student_stream: string;
  student_percentage: number;
  scheme_id: string;
  scheme_title: string;
  scheme_department: string;
  scheme_benefit: string;
  hardware_delivered?: string | null;
  request_type: 'scheme_application' | 'document_verification' | 'eligibility_query' | 'counseling';
  request_message: string;
  attached_documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'document_reupload_requested';
  strict_compliance_check: boolean;
  compliance_details?: {
    all_criteria_met: boolean;
    failure_reasons?: string[];
    checks?: Record<string, boolean>;
  };
  teacher_notes: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
}

export type StudentStatusOption = 'not_started' | 'preparing' | 'submitted_online' | 'offline_verified' | 'benefit_disbursed';

export interface StudentSchemeTracking {
  schemeId: string;
  status: StudentStatusOption;
  readyDocuments: string[];
  lastUpdated: string;
}

export interface SchemeReminder {
  id: string;
  schemeId: string;
  schemeTitle: string;
  deadline: string;
  daysBefore: number;
  reminderDate: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  collegeName?: string;
  studentProfile?: Partial<StudentProfile>;
  studentProfileCompleted?: boolean;
  savedSchemeIds?: string[];
  reminders?: SchemeReminder[];
}
