import React, { useState } from 'react';
import { AuthUser, Language, StudentProfile, UserRole } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  GraduationCap,
  UserCheck,
  Building2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Award,
  BookOpen
} from 'lucide-react';

interface AuthPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  onLogin: (user: AuthUser, initialProfile?: StudentProfile) => void;
}

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar',
  'Akola',
  'Amravati',
  'Chhatrapati Sambhajinagar (Aurangabad)',
  'Beed',
  'Bhandara',
  'Buldhana',
  'Chandrapur',
  'Dhule',
  'Gadchiroli',
  'Gondia',
  'Hingoli',
  'Jalgaon',
  'Jalna',
  'Kolhapur',
  'Latur',
  'Mumbai City',
  'Mumbai Suburban',
  'Nagpur',
  'Nanded',
  'Nandurbar',
  'Nashik',
  'Dharashiv (Osmanabad)',
  'Palghar',
  'Parbhani',
  'Pune',
  'Raigad',
  'Ratnagiri',
  'Sangli',
  'Satara',
  'Sindhudurg',
  'Solapur',
  'Thane',
  'Wardha',
  'Washim',
  'Yavatmal'
];

export const AuthPage: React.FC<AuthPageProps> = ({
  language,
  onLanguageChange,
  mode,
  onModeChange,
  onLogin
}) => {
  const t = TRANSLATIONS[language];

  // Auth flow state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2: Personal Details State
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [dob, setDob] = useState('2005-06-15');
  const [district, setDistrict] = useState('Pune');
  const [isMaharashtraDomicile, setIsMaharashtraDomicile] = useState(true);
  const [category, setCategory] = useState('EWS');

  // Step 3: Eligibility & Educational Details State (Structured dropdowns & ranges)
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [stream, setStream] = useState('Engineering & Technology');
  const [standardYear, setStandardYear] = useState('1st Year');
  const [incomeRange, setIncomeRange] = useState('₹1,00,001 - ₹2,50,000');
  const [percentageRange, setPercentageRange] = useState('75% - 84.9%');

  // Special Status Checkboxes
  const [hostelResident, setHostelResident] = useState(true);
  const [marginalFarmerChild, setMarginalFarmerChild] = useState(true);
  const [hasDisability, setHasDisability] = useState(false);
  const [exServicemanWard, setExServicemanWard] = useState(false);
  const [capAllotmentAdmitted, setCapAllotmentAdmitted] = useState(true);

  // Mapping income range to numeric rupees for strict matching
  const getNumericIncome = (rangeStr: string): number => {
    switch (rangeStr) {
      case 'Up to ₹1,00,000':
        return 90000;
      case '₹1,00,001 - ₹2,50,000':
        return 220000;
      case '₹2,50,001 - ₹8,00,000':
        return 650000;
      case 'Above ₹8,00,000':
        return 950000;
      default:
        return 220000;
    }
  };

  const getNumericPercentage = (rangeStr: string): number => {
    switch (rangeStr) {
      case '85% and above':
        return 88.5;
      case '75% - 84.9%':
        return 78.4;
      case '60% - 74.9%':
        return 66.0;
      case '50% - 59.9%':
        return 54.5;
      case 'Below 50%':
        return 46.0;
      default:
        return 75.0;
    }
  };

  // Handle Step 1 Submit (Account credentials)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    // Sign-In mode: authenticate and shift directly to dashboard
    if (mode === 'signin') {
      const user: AuthUser = {
        id: `user-${Date.now()}`,
        name: name || (role === 'teacher' ? 'Teacher Faculty' : email.split('@')[0] || 'Student User'),
        email,
        role,
        collegeId: 'college-default',
        collegeName: collegeName || 'State Educational Institution, Maharashtra',
        studentProfileCompleted: true
      };
      onLogin(user);
      return;
    }

    // If Teacher Role in Signup: completes registration and shifts directly to teacher guidance dashboard
    if (role === 'teacher') {
      const teacherUser: AuthUser = {
        id: `user-teacher-${Date.now()}`,
        name,
        email,
        role: 'teacher',
        collegeId: 'college-inst',
        collegeName: collegeName || 'State Educational Institution, Maharashtra',
        studentProfileCompleted: true
      };
      onLogin(teacherUser);
      return;
    }

    // If Student Role in Signup: proceeds to Step 2 (Personal Details)
    setCurrentStep(2);
  };

  // Handle Step 2 Submit (Personal Details) -> proceeds to Step 3 (Educational Details)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  // Handle Step 3 Submit (Educational Details) -> finalize and shift to dashboard
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericIncome = getNumericIncome(incomeRange);
    const numericPercentage = getNumericPercentage(percentageRange);

    const finalizedProfile: StudentProfile = {
      name: name || 'Student User',
      age: 19,
      dob,
      gender,
      educationLevel,
      standardYear,
      stream,
      state: 'Maharashtra',
      district,
      isMaharashtraDomicile,
      category,
      annualFamilyIncome: numericIncome,
      annualIncomeRange: incomeRange,
      percentage: numericPercentage,
      hostelResident,
      marginalFarmerChild,
      exServicemanWard,
      isOrphan: false,
      hasDisability,
      disabilityPercentage: hasDisability ? 45 : 0,
      capAllotmentAdmitted,
      firstGenerationLearner: true,
      documentAvailability: {
        AADHAAR: true,
        DOMICILE_MH: isMaharashtraDomicile,
        INCOME_CERT: true,
        CAP_ALLOTMENT: capAllotmentAdmitted,
        BONAFIDE_CERT: true,
        FEE_RECEIPT: true,
        '7/12_LAND_EXTRACT': marginalFarmerChild,
        HOSTEL_RENT_PROOF: hostelResident
      }
    };

    const newStudentUser: AuthUser = {
      id: `user-student-${Date.now()}`,
      name: name || 'Student User',
      email,
      role: 'student',
      collegeId: 'college-default',
      collegeName: collegeName || 'State Educational Institution, Maharashtra',
      studentProfile: finalizedProfile,
      studentProfileCompleted: true,
      savedSchemeIds: [],
      reminders: []
    };

    onLogin(newStudentUser, finalizedProfile);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Language Switcher */}
      <div className="max-w-lg mx-auto w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t.portalBadge}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              language === 'en'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('hi')}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              language === 'hi'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('mr')}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              language === 'mr'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.appTitle}
        </h1>
        <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
          {t.appNameSubtitle}
        </p>

        {/* Stepper (Only shown during Student Sign Up onboarding) */}
        {mode === 'signup' && role === 'student' && (
          <div className="pt-3 flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep === 1
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              <span>1. {t.step1Title}</span>
            </div>
            <div className="w-3 sm:w-4 h-0.5 bg-slate-300" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep === 2
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                  : currentStep > 2
                  ? 'bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <span>2. {t.step2Title}</span>
            </div>
            <div className="w-3 sm:w-4 h-0.5 bg-slate-300" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                currentStep === 3
                  ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <span>3. {t.step3Title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Form Card */}
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-6 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {/* Segmented Control for Log In / Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                onModeChange('signin');
                setCurrentStep(1);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.signInTitle}
            </button>
            <button
              type="button"
              onClick={() => {
                onModeChange('signup');
                setCurrentStep(1);
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.signUpTitle}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Basic Credentials (Log In or Sign Up Step 1) */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.selectRole}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      role === 'student'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{t.roleStudent}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      role === 'teacher'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{t.roleTeacher}</span>
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.emailAddress}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@educational.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {role === 'teacher' && mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.collegeNameLabel}</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder={t.collegeNamePlaceholder}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>
                  {mode === 'signin'
                    ? t.signInButton
                    : role === 'teacher'
                    ? t.completeRegistration
                    : `${t.nextPersonalDetails} →`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* STEP 2: Personal Details */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Step 2: {t.step2Title}
                  </h3>
                  <p className="text-[11px] text-slate-500">Provide your basic personal details</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  2 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.genderLabel}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="female">{t.genderFemale}</option>
                    <option value="male">{t.genderMale}</option>
                    <option value="other">{t.genderOther}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.districtLabel}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                >
                  {MAHARASHTRA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.domicileLabel}</label>
                  <select
                    value={isMaharashtraDomicile ? 'yes' : 'no'}
                    onChange={(e) => setIsMaharashtraDomicile(e.target.value === 'yes')}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="yes">{t.domicileYes}</option>
                    <option value="no">{t.domicileNo}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.categoryLabel}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="OPEN">OPEN / General</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="OBC">OBC</option>
                    <option value="VJNT">VJNT</option>
                    <option value="SBC">SBC</option>
                    <option value="Minority">Minority</option>
                    <option value="SEBC">SEBC</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backStep}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t.nextEligibilityDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Educational Details */}
          {currentStep === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Step 3: {t.step3Title}
                  </h3>
                  <p className="text-[11px] text-slate-500">Education, income range & academic criteria</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Final Step
                </span>
              </div>

              {/* Education Level (Dropdown) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.educationLevelLabel}</label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="10th/SSC">10th / SSC</option>
                    <option value="12th/HSC">12th / HSC</option>
                    <option value="ITI">ITI</option>
                    <option value="Diploma">Diploma (Polytechnic)</option>
                    <option value="Undergraduate">Undergraduate Degree</option>
                    <option value="Postgraduate">Postgraduate Degree</option>
                    <option value="Doctorate">Doctorate (Ph.D.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.academicStreamLabel}</label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="Medicine & Health Sciences">Medicine & Health Sciences</option>
                    <option value="Pure Science">Pure Science</option>
                    <option value="Arts & Humanities">Arts & Humanities</option>
                    <option value="Commerce & Management">Commerce & Management</option>
                    <option value="Agriculture & Allied">Agriculture & Allied</option>
                    <option value="Veterinary Sciences">Veterinary Sciences</option>
                    <option value="Fine Arts & Design">Fine Arts & Design</option>
                    <option value="Law">Law</option>
                    <option value="General / Other">General / Other</option>
                  </select>
                </div>
              </div>

              {/* Standard Year and Annual Income Range (Dropdown) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.annualIncomeLabel}</label>
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="Up to ₹1,00,000">{t.incomeUpTo1L}</option>
                    <option value="₹1,00,001 - ₹2,50,000">{t.income1Lto25L}</option>
                    <option value="₹2,50,001 - ₹8,00,000">{t.income25Lto8L}</option>
                    <option value="Above ₹8,00,000">{t.incomeAbove8L}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t.percentageRangeLabel}</label>
                  <select
                    value={percentageRange}
                    onChange={(e) => setPercentageRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="85% and above">{t.pct85Plus}</option>
                    <option value="75% - 84.9%">{t.pct75to84}</option>
                    <option value="60% - 74.9%">{t.pct60to74}</option>
                    <option value="50% - 59.9%">{t.pct50to59}</option>
                    <option value="Below 50%">{t.pctBelow50}</option>
                  </select>
                </div>
              </div>

              {/* Special Status Conditions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">{t.specialConditionsTitle}:</label>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={hostelResident}
                      onChange={(e) => setHostelResident(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">{t.hostelResidentCheck}</span>
                  </label>

                  <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={marginalFarmerChild}
                      onChange={(e) => setMarginalFarmerChild(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">{t.marginalFarmerChech}</span>
                  </label>

                  <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasDisability}
                      onChange={(e) => setHasDisability(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">{t.disabilityCheck}</span>
                  </label>

                  <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer flex items-center gap-2.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={capAllotmentAdmitted}
                      onChange={(e) => setCapAllotmentAdmitted(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">{t.capAllotmentCheck}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backStep}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{t.completeRegistration}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
