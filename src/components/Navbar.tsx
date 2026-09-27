import React from 'react';
import { AuthUser, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  Building2,
  Compass,
  Laptop,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Globe2,
  Bookmark
} from 'lucide-react';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  remindersCount?: number;
  onOpenRemindersModal?: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  remindersCount = 0,
  onOpenRemindersModal,
  savedCount = 0
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const isTeacherOrAdmin =
    currentUser?.role === 'teacher' ||
    currentUser?.role === 'counsellor' ||
    currentUser?.role === 'system_admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name - matching the image */}
          <div
            onClick={() => onTabChange(isTeacherOrAdmin ? 'teacher_dashboard' : 'matches')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium hidden sm:block">
                {t.appNameSubtitle}
              </div>
            </div>
          </div>

          {/* Navigation Links - matching the image */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600">
            {currentUser?.role === 'student' && (
              <>
                <button
                  type="button"
                  onClick={() => onTabChange('matches')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'matches'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.tabProfileAndMatches}
                </button>

                <button
                  type="button"
                  onClick={() => onTabChange('hardware')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'hardware'
                      ? 'bg-amber-600 text-white'
                      : 'hover:bg-amber-50 text-amber-900'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t.tabHardwareSchemes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTabChange('after-class')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'after-class'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.tabAfterClass}
                </button>
              </>
            )}

            {/* Teacher Guidance Dashboard: strictly protected */}
            {isTeacherOrAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => onTabChange('teacher_dashboard')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'teacher_dashboard'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.tabTeacherDashboard}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTabChange('institution')}
                  className={`px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'institution'
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.tabInstitutionReport}
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Reminders, Language, User Details & Logout */}
          <div className="flex items-center gap-2.5">
            {/* Student Reminders Quick Button */}
            {currentUser?.role === 'student' && onOpenRemindersModal && (
              <button
                type="button"
                onClick={onOpenRemindersModal}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-amber-50 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                title={t.myReminders}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {remindersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {remindersCount}
                  </span>
                )}
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-100 border border-slate-200 rounded-full p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-colors ${
                  currentLanguage === 'en'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-colors ${
                  currentLanguage === 'hi'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('mr')}
                className={`px-2 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-colors ${
                  currentLanguage === 'mr'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मरा
              </button>
            </div>

            {/* User Profile Chip - matching the image */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto gap-1 py-2 border-t border-slate-100 text-xs font-bold">
          {currentUser?.role === 'student' ? (
            <>
              <button
                type="button"
                onClick={() => onTabChange('matches')}
                className={`px-3 py-1.5 rounded-lg shrink-0 ${
                  activeTab === 'matches' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {t.tabProfileAndMatches}
              </button>
              <button
                type="button"
                onClick={() => onTabChange('hardware')}
                className={`px-3 py-1.5 rounded-lg shrink-0 ${
                  activeTab === 'hardware' ? 'bg-amber-600 text-white' : 'text-slate-600'
                }`}
              >
                {t.tabHardwareSchemes}
              </button>
              <button
                type="button"
                onClick={() => onTabChange('after-class')}
                className={`px-3 py-1.5 rounded-lg shrink-0 ${
                  activeTab === 'after-class' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {t.tabAfterClass}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onTabChange('teacher_dashboard')}
                className={`px-3 py-1.5 rounded-lg shrink-0 ${
                  activeTab === 'teacher_dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {t.tabTeacherDashboard}
              </button>
              <button
                type="button"
                onClick={() => onTabChange('institution')}
                className={`px-3 py-1.5 rounded-lg shrink-0 ${
                  activeTab === 'institution' ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                {t.tabInstitutionReport}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
