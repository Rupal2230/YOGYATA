import React from 'react';
import { Scheme, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  Laptop,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Send,
  Building,
  FileText
} from 'lucide-react';

interface HardwareSchemesDirectoryProps {
  schemes: Scheme[];
  language: Language;
  onOpenSchemeModal: (scheme: Scheme) => void;
  onRequestTeacherGuidance: (scheme: Scheme) => void;
  onSetReminder?: (scheme: Scheme) => void;
}

export const HardwareSchemesDirectory: React.FC<HardwareSchemesDirectoryProps> = ({
  schemes,
  language,
  onOpenSchemeModal,
  onRequestTeacherGuidance,
  onSetReminder
}) => {
  const t = TRANSLATIONS[language];
  const hardwareSchemes = schemes.filter((s) => s.hardware_delivered !== null);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
          <Laptop className="w-3.5 h-3.5" />
          <span>Statutory Device Allocation Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Government Devices, Tablets & Laptops Directory
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
          Authorized catalogue covering government-backed 4G/5G tablet distributions, civic municipal school digital devices, assistive screen-reader laptops for students with disabilities, and AICTE technical hardware grants.
        </p>
      </div>

      {/* Statutory Device Rule Notice */}
      <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-900">Anti-Fraud & Device Verification Notice:</span>
          <p>
            Beware of fraudulent third-party portals claiming "Free Laptop Schemes for all Maharashtra Students". Only trust statutory schemes notified by government gazette (Mahajyoti, BARTI, TRTI, SARTHI, BMC, DEPwD, and AICTE). Government-issued devices carry asset tracking IMEI / serial numbers and are strictly non-transferable.
          </p>
        </div>
      </div>

      {/* Hardware Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hardwareSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl border border-amber-200 ring-1 ring-amber-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[180px]">
                  {scheme.department}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                  <Laptop className="w-3 h-3 text-amber-700" />
                  <span>Physical Hardware</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {scheme.title}
              </h3>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1 text-amber-950">
                <div className="text-[10px] uppercase font-bold text-amber-800">
                  {t.hardwareDelivered}
                </div>
                <div className="font-bold text-xs leading-snug">{scheme.hardware_delivered}</div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Target Beneficiary:</span>
                  <span className="font-semibold text-slate-800">{scheme.target_audience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t.incomeLimit}:</span>
                  <span className="font-semibold text-slate-800">{scheme.income_limit_text}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Level / Class:</span>
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
                <span className="text-[11px] text-slate-600 truncate">Have doubts about this scheme?</span>
                <button
                  type="button"
                  onClick={() => onRequestTeacherGuidance(scheme)}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 shrink-0 cursor-pointer"
                >
                  {t.requestGuidance} →
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenSchemeModal(scheme)}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Device SOP</span>
              </button>

              <button
                type="button"
                onClick={() => onRequestTeacherGuidance(scheme)}
                className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>Ask Teacher</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
