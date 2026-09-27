import React, { useState } from 'react';
import { StudentProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  User,
  GraduationCap,
  Percent,
  CheckCircle2,
  FileCheck,
  Building,
  Save,
  HelpCircle,
  Home,
  ShieldCheck
} from 'lucide-react';

interface StudentProfileFormProps {
  profile: StudentProfile;
  onProfileChange: (newProfile: StudentProfile) => void;
  onSaveProfile: (profile: StudentProfile) => void;
  profileCompleted: boolean;
  language: Language;
  matchingCount: { likely: number };
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

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  profile,
  onProfileChange,
  onSaveProfile,
  profileCompleted,
  language,
  matchingCount
}) => {
  const t = TRANSLATIONS[language];
  const [localProfile, setLocalProfile] = useState<StudentProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Income mapping helper
  const getIncomeRangeFromValue = (val: number): string => {
    if (val <= 100000) return 'Up to ₹1,00,000';
    if (val <= 250000) return '₹1,00,001 - ₹2,50,000';
    if (val <= 800000) return '₹2,50,001 - ₹8,00,000';
    return 'Above ₹8,00,000';
  };

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

  const [selectedIncomeRange, setSelectedIncomeRange] = useState<string>(() =>
    localProfile.annualIncomeRange || getIncomeRangeFromValue(localProfile.annualFamilyIncome)
  );

  const handleChange = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    const updated = { ...localProfile, [field]: value };
    setLocalProfile(updated);
    onProfileChange(updated);
  };

  const handleIncomeRangeChange = (rangeStr: string) => {
    setSelectedIncomeRange(rangeStr);
    const num = getNumericIncome(rangeStr);
    const updated: StudentProfile = {
      ...localProfile,
      annualIncomeRange: rangeStr,
      annualFamilyIncome: num
    };
    setLocalProfile(updated);
    onProfileChange(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(localProfile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Eligibility Parameter Verification
          </div>
          <h2 className="text-lg font-bold">Student Profile & Matching Criteria</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Schemes are matched against these parameters. Any criterion not met will hide the scheme.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-400 block"> Matches</span>
          <span className="text-2xl font-bold text-emerald-400 tabular-nums">{matchingCount.likely}</span>
        </div>
      </div>

      <div className="p-6 space-y-6 text-xs text-slate-700">
        {/* Row 1: Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={localProfile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold"
              placeholder="Enter student full name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select
              value={localProfile.gender}
              onChange={(e) => handleChange('gender', e.target.value as 'male' | 'female' | 'other')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maharashtra Domicile</label>
            <select
              value={localProfile.isMaharashtraDomicile ? 'yes' : 'no'}
              onChange={(e) => handleChange('isMaharashtraDomicile', e.target.value === 'yes')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category & Structured Annual Income Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Social Category (Caste / Quota)
            </label>
            <select
              value={localProfile.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="OPEN">OPEN / General</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="OBC">OBC (Other Backward Classes)</option>
              <option value="VJNT">VJNT (Vimukta Jati & Nomadic Tribes)</option>
              <option value="SBC">SBC (Special Backward Class)</option>
              <option value="Minority">Minority (Muslim, Christian, Buddhist, Jain, Sikh)</option>
              <option value="SEBC">SEBC / Maratha</option>
            </select>
          </div>

          {/* Structured Annual Income Range Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Annual Family Income Range
            </label>
            <select
              value={selectedIncomeRange}
              onChange={(e) => handleIncomeRangeChange(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50 text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="Up to ₹1,00,000">{t.incomeUpTo1L}</option>
              <option value="₹1,00,001 - ₹2,50,000">{t.income1Lto25L}</option>
              <option value="₹2,50,001 - ₹8,00,000">{t.income25Lto8L}</option>
              <option value="Above ₹8,00,000">{t.incomeAbove8L}</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Calculated Value: ₹{localProfile.annualFamilyIncome.toLocaleString('en-IN')} / Year
            </span>
          </div>

          {/* Qualifying Marks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Qualifying Marks (%)
            </label>
            <input
              type="number"
              required
              min={35}
              max={100}
              step={0.1}
              value={localProfile.percentage}
              onChange={(e) => handleChange('percentage', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold"
              placeholder="e.g. 84.5"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              10th / 12th / Degree qualifying examination score
            </span>
          </div>
        </div>

        {/* Row 3: Structured Education Level & Academic Stream Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Education Level (Dropdown)
            </label>
            <select
              value={localProfile.educationLevel}
              onChange={(e) => handleChange('educationLevel', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="10th/SSC">10th / SSC (Secondary School)</option>
              <option value="12th/HSC">12th / HSC (Junior College)</option>
              <option value="ITI">ITI (Craftsman Training Scheme)</option>
              <option value="Diploma">Diploma (Polytechnic)</option>
              <option value="Undergraduate">Undergraduate Degree (B.Tech, B.Sc, BA, B.Com)</option>
              <option value="Postgraduate">Postgraduate Degree (M.Tech, M.Sc, MA, MBA)</option>
              <option value="Doctorate">Doctorate (Ph.D. / M.Phil Research)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Academic Stream (Dropdown)
            </label>
            <select
              value={localProfile.stream}
              onChange={(e) => handleChange('stream', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Medicine & Health Sciences">Medicine & Health Sciences</option>
              <option value="Pure Science">Pure Science / Mathematics / Physics</option>
              <option value="Arts & Humanities">Arts & Humanities</option>
              <option value="Commerce & Management">Commerce & Management</option>
              <option value="Agriculture & Allied">Agriculture & Allied</option>
              <option value="Veterinary Sciences">Veterinary & Animal Sciences</option>
              <option value="Fine Arts & Design">Fine Arts & Design</option>
              <option value="Law">Law (LLB / LLM)</option>
              <option value="General / Other">General / Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">District in Maharashtra</label>
            <select
              value={localProfile.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-xs font-semibold cursor-pointer"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Special Status Conditions */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Special Status Entitlements (Check all that apply):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer flex items-start gap-2.5 transition-colors">
              <input
                type="checkbox"
                checked={localProfile.hostelResident}
                onChange={(e) => handleChange('hostelResident', e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block text-xs">Hostel / Rented Room</span>
                <span className="text-[10px] text-slate-500">Residing away from native home</span>
              </div>
            </label>

            <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer flex items-start gap-2.5 transition-colors">
              <input
                type="checkbox"
                checked={localProfile.marginalFarmerChild}
                onChange={(e) => handleChange('marginalFarmerChild', e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
            </label>

            <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer flex items-start gap-2.5 transition-colors">
              <input
                type="checkbox"
                checked={localProfile.hasDisability}
                onChange={(e) => handleChange('hasDisability', e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block text-xs">Benchmark Disability</span>
                <span className="text-[10px] text-slate-500">UDID Card (≥ 40% Impairment)</span>
              </div>
            </label>

            <label className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer flex items-start gap-2.5 transition-colors">
              <input
                type="checkbox"
                checked={localProfile.capAllotmentAdmitted !== false}
                onChange={(e) => handleChange('capAllotmentAdmitted', e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block text-xs">CAP Round Admission</span>
                <span className="text-[10px] text-slate-500">Centralized Merit Allotment</span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium">
            {saveSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profile updated & strict criteria matching refreshed!
              </span>
            ) : (
              <span>Updating dropdown criteria re-evaluates all 59 schemes immediately.</span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors ml-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile & Refresh Strict Matches</span>
          </button>
        </div>
      </div>
    </form>
  );
};
