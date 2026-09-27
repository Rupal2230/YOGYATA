import React, { useState, useMemo, useEffect } from 'react';
import {
  AuthUser,
  Language,
  Scheme,
  StudentProfile,
  StudentSchemeTracking,
  StudentStatusOption,
  UserRole,
  GuidanceRequest,
  SchemeReminder
} from './types';
import { TRANSLATIONS } from './data/translations';
import { SCHEMES_DATABASE } from './data/schemesData';
import { matchStudentWithSchemes, evaluateStrictEligibility } from './utils/matchingEngine';
import { Navbar } from './components/Navbar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { PersonalizedSchemeList } from './components/PersonalizedSchemeList';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { TeacherGuidanceDashboard } from './components/TeacherGuidanceDashboard';
import { HardwareSchemesDirectory } from './components/HardwareSchemesDirectory';
import { WhatAfterThisClass } from './components/WhatAfterThisClass';
import { InstitutionAwarenessReport } from './components/InstitutionAwarenessReport';
import { AuthPage } from './components/AuthPage';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Users,
  ArrowRight,
  UserCheck,
  Laptop,
  ShieldCheck,
  AlertCircle,
  GraduationCap,
  Bell,
  Bookmark,
  MessageSquare,
  X,
  Send,
  Trash2
} from 'lucide-react';

const INITIAL_PROFILE: StudentProfile = {
  name: 'Student User',
  age: 19,
  dob: '2005-06-15',
  gender: 'female',
  educationLevel: 'Undergraduate',
  standardYear: '1st Year',
  stream: 'Engineering & Technology',
  state: 'Maharashtra',
  district: 'Pune',
  isMaharashtraDomicile: true,
  category: 'EWS',
  annualFamilyIncome: 220000,
  annualIncomeRange: '₹1,00,001 - ₹2,50,000',
  percentage: 84.5,
  hostelResident: true,
  marginalFarmerChild: true,
  exServicemanWard: false,
  isOrphan: false,
  hasDisability: false,
  disabilityPercentage: 0,
  capAllotmentAdmitted: true,
  firstGenerationLearner: true,
  documentAvailability: {
    AADHAAR: true,
    DOMICILE_MH: true,
    INCOME_CERT: true,
    CAP_ALLOTMENT: true,
    BONAFIDE_CERT: true,
    FEE_RECEIPT: true,
    '7/12_LAND_EXTRACT': true,
    HOSTEL_RENT_PROOF: true
  }
};

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');

  // Authenticated User State: Starts null so website always starts from Log In / Sign Up page!
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('yogyata_session_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const [activeTab, setActiveTab] = useState<string>('matches');

  // Student Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('yogyata_profile');
      if (savedProfile) return JSON.parse(savedProfile);
    } catch {
      // fallback
    }
    return INITIAL_PROFILE;
  });

  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);

  // Modal states
  const [activeDetailScheme, setActiveDetailScheme] = useState<Scheme | null>(null);

  // Bookmarked / Saved Schemes State
  const [savedSchemeIds, setSavedSchemeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('yogyata_saved_schemes');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set();
  });

  // Reminders State
  const [reminders, setReminders] = useState<SchemeReminder[]>(() => {
    try {
      const saved = localStorage.getItem('yogyata_reminders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [showRemindersModal, setShowRemindersModal] = useState<boolean>(false);
  const [activeReminderScheme, setActiveReminderScheme] = useState<Scheme | null>(null);
  const [reminderDaysChoice, setReminderDaysChoice] = useState<number>(7);

  // Optional Query Modal State (Per-Scheme Guidance Request)
  const [activeQueryScheme, setActiveQueryScheme] = useState<Scheme | null>(null);
  const [queryInputText, setQueryInputText] = useState<string>('');
  const [querySubmitSuccess, setQuerySubmitSuccess] = useState<boolean>(false);

  // Application feedback toast
  const [applyToast, setApplyToast] = useState<string | null>(null);

  // Tracking map per scheme
  const [trackingMap, setTrackingMap] = useState<Record<string, StudentSchemeTracking>>(() => {
    try {
      const saved = localStorage.getItem('yogyata_tracking');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // Teacher Guidance Requests List (Starts empty; only keeps requests actually submitted!)
  const [guidanceRequests, setGuidanceRequests] = useState<GuidanceRequest[]>(() => {
    try {
      const saved = localStorage.getItem('yogyata_guidance_requests');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Fetch from server if running
  useEffect(() => {
    fetch('/api/teacher/requests')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.requests) {
          setGuidanceRequests((prev) => (prev.length > 0 ? prev : data.requests));
        }
      })
      .catch(() => undefined);
  }, []);

  // Save changes to sessionStorage/localStorage
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('yogyata_session_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('yogyata_session_user');
      localStorage.removeItem('yogyata_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('yogyata_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('yogyata_saved_schemes', JSON.stringify(Array.from(savedSchemeIds)));
  }, [savedSchemeIds]);

  useEffect(() => {
    localStorage.setItem('yogyata_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('yogyata_tracking', JSON.stringify(trackingMap));
  }, [trackingMap]);

  useEffect(() => {
    localStorage.setItem('yogyata_guidance_requests', JSON.stringify(guidanceRequests));
  }, [guidanceRequests]);

  // STRICT ROLE ISOLATION:
  // If currentUser is student, they must NEVER access teacher_dashboard!
  useEffect(() => {
    if (currentUser?.role === 'student' && activeTab === 'teacher_dashboard') {
      setActiveTab('matches');
    }
  }, [currentUser, activeTab]);

  const t = TRANSLATIONS[language];

  // Strict Criteria Matching Engine Execution
  const strictMatchResults = useMemo(() => {
    return matchStudentWithSchemes(profile, SCHEMES_DATABASE);
  }, [profile]);

  const matchingCounts = useMemo(() => {
    return { likely: strictMatchResults.length };
  }, [strictMatchResults]);

  const remindedSchemeIds = useMemo(() => {
    return new Set(reminders.map((r) => r.schemeId));
  }, [reminders]);

  // Auth Handlers
  const handleLogin = (user: AuthUser, initialProfile?: StudentProfile) => {
    setCurrentUser(user);
    sessionStorage.setItem('yogyata_session_user', JSON.stringify(user));
    if (initialProfile) {
      setProfile(initialProfile);
    }
    if (user.role === 'teacher' || user.role === 'counsellor' || user.role === 'system_admin') {
      setActiveTab('teacher_dashboard');
    } else {
      setActiveTab('matches');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthMode('signin');
    sessionStorage.removeItem('yogyata_session_user');
    localStorage.removeItem('yogyata_user');
  };

  // Toggle Save / Bookmark Scheme
  const handleToggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) => {
      const next = new Set(prev);
      if (next.has(schemeId)) {
        next.delete(schemeId);
      } else {
        next.add(schemeId);
      }
      return next;
    });
  };

  // Set Reminder Handlers
  const handleOpenSetReminderModal = (scheme: Scheme) => {
    setActiveReminderScheme(scheme);
    setReminderDaysChoice(7);
  };

  const handleConfirmSetReminder = () => {
    if (!activeReminderScheme) return;
    const deadlineDate = new Date(activeReminderScheme.deadline);
    const reminderDateObj = new Date(deadlineDate);
    reminderDateObj.setDate(reminderDateObj.getDate() - reminderDaysChoice);

    const newReminder: SchemeReminder = {
      id: `rem-${Date.now()}`,
      schemeId: activeReminderScheme.id,
      schemeTitle: activeReminderScheme.title,
      deadline: activeReminderScheme.deadline,
      daysBefore: reminderDaysChoice,
      reminderDate: reminderDateObj.toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReminders((prev) => [newReminder, ...prev.filter((r) => r.schemeId !== activeReminderScheme.id)]);
    setActiveReminderScheme(null);
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Apply for Scheme Handler
  const handleApplyScheme = (scheme: Scheme) => {
    // 1. Mark status as submitted_online
    setTrackingMap((prev) => ({
      ...prev,
      [scheme.id]: {
        schemeId: scheme.id,
        status: 'submitted_online',
        readyDocuments: prev[scheme.id]?.readyDocuments || scheme.required_documents,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }));

    // 2. Open official portal in new tab
    if (scheme.portal_url) {
      window.open(scheme.portal_url, '_blank', 'noopener,noreferrer');
    }

    // 3. Show feedback toast
    setApplyToast(`Application initiated for "${scheme.title}". Official portal opened.`);
    setTimeout(() => setApplyToast(null), 4000);
  };

  // Ask Query / Guidance Request Per Scheme
  const handleOpenQueryModal = (scheme: Scheme) => {
    setActiveQueryScheme(scheme);
    setQueryInputText('');
    setQuerySubmitSuccess(false);
  };

  const handleSubmitQueryModal = () => {
    if (!activeQueryScheme) return;
    const msg = queryInputText || `Inquiry regarding eligibility and required documents for ${activeQueryScheme.title}`;
    handleSubmitGuidanceRequest(activeQueryScheme, msg);
    setQuerySubmitSuccess(true);
    setTimeout(() => {
      setActiveQueryScheme(null);
      setQuerySubmitSuccess(false);
    }, 1500);
  };

  // Status Change for Student Tracking
  const handleStatusChange = (schemeId: string, status: StudentStatusOption) => {
    setTrackingMap((prev) => ({
      ...prev,
      [schemeId]: {
        schemeId,
        status,
        readyDocuments: prev[schemeId]?.readyDocuments || [],
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const handleToggleDocumentReady = (schemeId: string, docId: string) => {
    setTrackingMap((prev) => {
      const existing = prev[schemeId] || {
        schemeId,
        status: 'preparing',
        readyDocuments: [],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      const set = new Set(existing.readyDocuments);
      if (set.has(docId)) {
        set.delete(docId);
      } else {
        set.add(docId);
      }
      return {
        ...prev,
        [schemeId]: {
          ...existing,
          readyDocuments: Array.from(set),
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      };
    });
  };

  // Teacher Workflow Status Update Handler
  const handleUpdateTeacherRequestStatus = (
    requestId: string,
    newStatus: 'pending' | 'approved' | 'rejected' | 'document_reupload_requested',
    teacherNotes: string
  ) => {
    setGuidanceRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: newStatus,
              teacher_notes: teacherNotes,
              reviewed_by: currentUser?.name || 'Prof. Arvind Deshmukh',
              reviewed_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : r
      )
    );

    fetch(`/api/teacher/requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        teacher_notes: teacherNotes,
        reviewer_id: currentUser?.id
      })
    }).catch(() => undefined);
  };

  // Student Submit Guidance Request Handler (Real dynamic storage)
  const handleSubmitGuidanceRequest = (scheme: Scheme, message: string) => {
    const evaluation = evaluateStrictEligibility(profile, scheme);

    const newReq: GuidanceRequest = {
      id: `req-${Date.now()}`,
      student_id: currentUser?.id || 'student-1',
      student_name: profile.name,
      student_category: profile.category,
      student_income: profile.annualFamilyIncome,
      student_class: profile.standardYear || profile.educationLevel,
      student_stream: profile.stream,
      student_percentage: profile.percentage,
      scheme_id: scheme.id,
      scheme_title: scheme.title,
      scheme_department: scheme.department,
      scheme_benefit: scheme.benefit_details,
      hardware_delivered: scheme.hardware_delivered,
      request_type: 'scheme_application',
      request_message: message,
      attached_documents: scheme.required_documents,
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

    setGuidanceRequests((prev) => [newReq, ...prev]);

    fetch('/api/guidance/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: { ...profile, id: currentUser?.id },
        scheme,
        message
      })
    }).catch(() => undefined);
  };

  // If user is not logged in, render Clean Slate & Amber Auth & Onboarding Flow
  if (!currentUser) {
    return (
      <AuthPage
        language={language}
        onLanguageChange={setLanguage}
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {applyToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 shadow-xl flex items-center gap-3 animate-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{applyToast}</div>
          <button
            type="button"
            onClick={() => setApplyToast(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Gazette Notification Bar - Exact style from image */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[11px] sm:text-xs">
              <strong className="text-white">{t.noticeTitle}:</strong> {t.disclaimerBanner}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
            <span>MahaDBT · NSP · AICTE · DBT Verified</span>
            <span>·</span>
            <span>Year 2026–27</span>
          </div>
        </div>
      </div>

      {/* Main Navbar - Exact style from image */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={setLanguage}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (currentUser.role === 'student' && tab === 'teacher_dashboard') {
            return;
          }
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        remindersCount={reminders.length}
        onOpenRemindersModal={() => setShowRemindersModal(true)}
        savedCount={savedSchemeIds.size}
      />

      {/* Hero Welcome Banner (Visible on Student Matches Tab) - Exact style from image */}
      {activeTab === 'matches' && currentUser.role === 'student' && (
        <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.portalBadge}</span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {t.appTitle}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-wide">
                    {t.appNameSubtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t.heroDescription}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700 pt-2">
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {t.heroPrivacy}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    {t.heroDeadlines}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1.5 text-blue-800">
                    <Users className="w-4 h-4 text-blue-600" />
                    {t.heroTeacherDesk}
                  </span>
                </div>
              </div>

              {/* Right Column Quick Eligibility Card - Exact style from image */}
              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                    Welcome, {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-emerald-700 font-bold">● {t.activeIntake}</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-600"> Verified Opportunities:</div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                      {strictMatchResults.length} Schemes
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      100% Parameter Criteria Passed
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProfileEditor((v) => !v)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{showProfileEditor ? 'Close Criteria Editor' : t.editStudentCriteria}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Profile Editor (Collapsible) */}
        {showProfileEditor && activeTab === 'matches' && (
          <div className="animate-in">
            <StudentProfileForm
              profile={profile}
              onProfileChange={setProfile}
              onSaveProfile={setProfile}
              profileCompleted={true}
              language={language}
              matchingCount={matchingCounts}
            />
          </div>
        )}

        {/* TAB 1: Student Personalized Schemes (Strict Matching Only) */}
        {activeTab === 'matches' && (
          <PersonalizedSchemeList
            matchResults={strictMatchResults}
            language={language}
            profile={profile}
            trackingMap={trackingMap}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onSetReminder={handleOpenSetReminderModal}
            onOpenQueryModal={handleOpenQueryModal}
            onApplyScheme={handleApplyScheme}
            onStatusChange={handleStatusChange}
            onOpenSchemeModal={setActiveDetailScheme}
            remindedSchemeIds={remindedSchemeIds}
          />
        )}

        {/* TAB 2: Hardware Devices & Laptops Directory */}
        {activeTab === 'hardware' && (
          <HardwareSchemesDirectory
            schemes={SCHEMES_DATABASE}
            language={language}
            onOpenSchemeModal={setActiveDetailScheme}
            onRequestTeacherGuidance={handleOpenQueryModal}
            onSetReminder={handleOpenSetReminderModal}
          />
        )}

        {/* TAB 3: What After This Class? */}
        {activeTab === 'after-class' && (
          <WhatAfterThisClass
            language={language}
            onSelectScheme={setActiveDetailScheme}
          />
        )}

        {/* TAB 4: Dedicated Teacher Guidance Dashboard (ROLE ISOLATED, ZERO SAMPLE DATA) */}
        {activeTab === 'teacher_dashboard' && (
          <TeacherGuidanceDashboard
            language={language}
            currentUser={currentUser}
            requests={guidanceRequests}
            onUpdateRequestStatus={handleUpdateTeacherRequestStatus}
            onOpenSchemeModal={setActiveDetailScheme}
            onNavigateToStudentDashboard={() => setActiveTab('matches')}
          />
        )}

        {/* TAB 5: School / College Awareness Report */}
        {activeTab === 'institution' && (
          <InstitutionAwarenessReport language={language} />
        )}
      </main>

      {/* Scheme Detail & Document Checklist Modal */}
      <SchemeDetailModal
        scheme={activeDetailScheme}
        onClose={() => setActiveDetailScheme(null)}
        language={language}
        tracking={activeDetailScheme ? trackingMap[activeDetailScheme.id] : undefined}
        onToggleDocumentReady={handleToggleDocumentReady}
        onStatusChange={handleStatusChange}
        onSubmitGuidanceRequest={handleSubmitGuidanceRequest}
        isSaved={activeDetailScheme ? savedSchemeIds.has(activeDetailScheme.id) : false}
        onToggleSave={handleToggleSaveScheme}
        onSetReminder={handleOpenSetReminderModal}
        hasReminder={activeDetailScheme ? remindedSchemeIds.has(activeDetailScheme.id) : false}
      />

      {/* Set Reminder Dialog Modal */}
      {activeReminderScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{t.setReminder}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReminderScheme(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{activeReminderScheme.title}</div>
                <div className="text-slate-500">
                  {t.deadline}: <strong className="text-slate-800">{activeReminderScheme.deadline}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.remindMeDaysBefore}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 3, 1].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setReminderDaysChoice(days)}
                      className={`py-2 px-3 rounded-lg border font-bold text-xs cursor-pointer transition-colors ${
                        reminderDaysChoice === days
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveReminderScheme(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSetReminder}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
              >
                {t.confirmReminder}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student My Reminders Modal */}
      {showRemindersModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{t.myReminders}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {reminders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>{t.noReminders}</p>
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 leading-snug">{rem.schemeTitle}</div>
                      <div className="text-[11px] text-slate-500">
                        {t.deadline}: <strong className="text-slate-800">{rem.deadline}</strong> · Alert:{' '}
                        <strong>{rem.daysBefore} days before</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional Ask Query Modal (Per-Scheme) */}
      {activeQueryScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{t.askTeacherModalTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveQueryScheme(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{activeQueryScheme.title}</div>
                <div className="text-[11px] text-slate-500">{activeQueryScheme.department}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.optionalQueryLabel}
                </label>
                <textarea
                  rows={4}
                  value={queryInputText}
                  onChange={(e) => setQueryInputText(e.target.value)}
                  placeholder="e.g. Respected Teacher, could you please verify if my income certificate qualifies for this scholarship?"
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {querySubmitSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.querySuccess}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveQueryScheme(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitQueryModal}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendQueryButton}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Language Switcher */}
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-0.5 bg-white/95 backdrop-blur border border-slate-200 rounded-full shadow-lg p-1">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full cursor-pointer ${
            language === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full cursor-pointer ${
            language === 'hi' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          हिं
        </button>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-full cursor-pointer ${
            language === 'mr' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          मरा
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                <span>{t.appTitle}</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                YOGYATA: Comprehensive 52 Government Schemes Master Directory & 7 Hardware Device Initiatives with strict eligibility matching and Teacher Guidance Workflow.
              </p>
              </div>

            <div className="space-y-2">
              <div className="text-white font-semibold uppercase tracking-wider text-xs">
                Official Portals
              </div>
              <ul className="space-y-1 text-slate-400">
                <li><a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">MahaDBT Portal ↗</a></li>
                <li><a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">National Scholarship Portal (NSP) ↗</a></li>
                <li><a href="https://mahajyoti.org.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">Mahajyoti Nagpur ↗</a></li>
                <li><a href="https://barti.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">BARTI Pune ↗</a></li>
                <li><a href="https://trti.maharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">TRTI Pune ↗</a></li>
                <li><a href="https://sarthi-maharashtragov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400">SARTHI Pune ↗</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold uppercase tracking-wider text-xs">
                Workspace Views
              </div>
              <ul className="space-y-1 text-slate-400">
                <li><button onClick={() => setActiveTab('matches')} className="hover:text-white cursor-pointer">{t.tabProfileAndMatches}</button></li>
                <li><button onClick={() => setActiveTab('hardware')} className="hover:text-white cursor-pointer">{t.tabHardwareSchemes}</button></li>
                <li><button onClick={() => setActiveTab('after-class')} className="hover:text-white cursor-pointer">{t.tabAfterClass}</button></li>
                {currentUser?.role === 'teacher' && (
                  <li><button onClick={() => setActiveTab('teacher_dashboard')} className="hover:text-white cursor-pointer">{t.tabTeacherDashboard}</button></li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
