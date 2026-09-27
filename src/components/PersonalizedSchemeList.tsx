import React, { useState, useMemo } from 'react';
import {
  Scheme,
  StrictMatchEvaluation,
  Language,
  StudentProfile,
  StudentSchemeTracking,
  StudentStatusOption
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  Laptop,
  FileText,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  AlertCircle,
  Bookmark,
  Bell,
  MessageSquare
} from 'lucide-react';

interface PersonalizedSchemeListProps {
  matchResults: StrictMatchEvaluation[];
  language: Language;
  profile: StudentProfile;
  trackingMap: Record<string, StudentSchemeTracking>;
  savedSchemeIds: Set<string>;
  onToggleSaveScheme: (schemeId: string) => void;
  onSetReminder: (scheme: Scheme) => void;
  onOpenQueryModal: (scheme: Scheme) => void;
  onApplyScheme: (scheme: Scheme) => void;
  onStatusChange: (schemeId: string, status: StudentStatusOption) => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
  remindedSchemeIds?: Set<string>;
}

export const PersonalizedSchemeList: React.FC<PersonalizedSchemeListProps> = ({
  matchResults,
  language,
  profile,
  trackingMap,
  savedSchemeIds,
  onToggleSaveScheme,
  onSetReminder,
  onOpenQueryModal,
  onApplyScheme,
  onStatusChange,
  onOpenSchemeModal,
  remindedSchemeIds = new Set()
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [filterSavedOnly, setFilterSavedOnly] = useState<boolean>(false);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return matchResults.filter(({ scheme }) => {
      // Saved filter
      if (filterSavedOnly && !savedSchemeIds.has(scheme.id)) {
        return false;
      }

      const matchesSearch =
        scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.benefit_details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategoryFilter === 'all' ||
        scheme.target_audience.toLowerCase().includes(activeCategoryFilter.toLowerCase());

      const matchesType =
        activeTypeFilter === 'all' ||
        (activeTypeFilter === 'hardware' && scheme.hardware_delivered !== null) ||
        (activeTypeFilter === 'hostel' && scheme.requires_hostel) ||
        (activeTypeFilter === 'merit' && scheme.scheme_category === 'merit_scholarship');

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [matchResults, searchTerm, activeCategoryFilter, activeTypeFilter, filterSavedOnly, savedSchemeIds]);

  const hardwareCount = useMemo(() => {
    return matchResults.filter((m) => m.scheme.hardware_delivered !== null).length;
  }, [matchResults]);

  return (
    <div className="space-y-6">
      {/* Filtering Bar - Matching image.png */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchSchemesPlaceholder}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          {/* Quick Category & Saved Filter Pills - Exact image layout */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTypeFilter('all');
                setFilterSavedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTypeFilter === 'all' && !filterSavedOnly
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.allEligible} ({matchResults.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTypeFilter('hardware');
                setFilterSavedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTypeFilter === 'hardware' && !filterSavedOnly
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{t.hardwareSchemes} ({hardwareCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTypeFilter('hostel');
                setFilterSavedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTypeFilter === 'hostel' && !filterSavedOnly
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.hostelStipends}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTypeFilter('merit');
                setFilterSavedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTypeFilter === 'merit' && !filterSavedOnly
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.meritGrants}
            </button>

            {/* Saved Schemes Filter Button */}
            <button
              type="button"
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filterSavedOnly
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterSavedOnly ? 'fill-white' : ''}`} />
              <span>Saved ({savedSchemeIds.size})</span>
            </button>
          </div>
        </div>

        {/* Verification Status Bar - Exact matching to image */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
             Criteria Verification Active: Matched to <strong>{profile.category}</strong> ·{' '}
              <strong>₹{profile.annualFamilyIncome.toLocaleString('en-IN')}</strong> ·{' '}
              <strong>{profile.educationLevel}</strong> ({profile.percentage}%)
            </span>
          </div>
          <div className="font-semibold text-slate-700">
            {filteredSchemes.length} of {matchResults.length} schemes displayed
          </div>
        </div>
      </div>

      {/* Schemes Grid - Exactly like image.png */}
      {filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching schemes for this search filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query or switching to 'All Eligible' to view your verified opportunities.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setActiveTypeFilter('all');
              setFilterSavedOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map(({ scheme }) => {
            const isHardware = scheme.hardware_delivered !== null;
            const tracking = trackingMap[scheme.id];
            const isSaved = savedSchemeIds.has(scheme.id);
            const hasReminder = remindedSchemeIds.has(scheme.id);

            return (
              <div
                key={scheme.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isHardware
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Strip & Body */}
                <div className="p-5 space-y-3 flex-1">
                  {/* Category and Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[170px]">
                      {scheme.department}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Set Reminder Button */}
                      <button
                        type="button"
                        onClick={() => onSetReminder(scheme)}
                        className={`p-1 rounded-md border transition-colors cursor-pointer ${
                          hasReminder
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title={hasReminder ? t.reminderSet : t.setReminder}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>

                      {/* Bookmark / Save Button */}
                      <button
                        type="button"
                        onClick={() => onToggleSaveScheme(scheme.id)}
                        className={`p-1 rounded-md border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title={isSaved ? t.saved : t.saveScheme}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                      </button>

                      {/* Eligible Badge */}
                      {isHardware ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Laptop className="w-3 h-3 text-amber-700" />
                          <span>Physical Hardware</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>100% Eligible</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {scheme.title}
                  </h3>

                  {/* Approved Statutory Benefit Badge (Exact style from image) */}
                  <div className={`p-3 rounded-xl border text-xs ${
                    isHardware ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                      {isHardware ? 'Delivered Hardware & Data' : 'Approved Statutory Benefit'}
                    </div>
                    <div className="font-bold text-xs leading-snug">
                      {isHardware ? scheme.hardware_delivered : scheme.benefit_details}
                    </div>
                  </div>

                  {/* Key Qualification Summary */}
                  <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Target Group:</span>
                      <span className="font-semibold text-slate-800">{scheme.target_audience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t.incomeLimit}:</span>
                      <span className="font-semibold text-slate-800">{scheme.income_limit_text}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Required Level:</span>
                      <span className="font-semibold text-slate-800">{scheme.level}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{t.deadline}:</span>
                      </span>
                      <span className="font-bold text-amber-800">{scheme.deadline}</span>
                    </div>
                  </div>

                  {/* Optional Query / Guidance Request Inline Box */}
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-600 truncate">Need teacher verification for this?</span>
                    <button
                      type="button"
                      onClick={() => onOpenQueryModal(scheme)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 shrink-0 cursor-pointer"
                    >
                      {t.requestGuidance} →
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenSchemeModal(scheme)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>View SOP & Docs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApplyScheme(scheme)}
                    className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>{t.applyNow}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
