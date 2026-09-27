import React from 'react';
import { Language } from '../types';
import { SCHEMES_DATABASE } from '../data/schemesData';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  TrendingUp,
  Download
} from 'lucide-react';

interface InstitutionAwarenessReportProps {
  language: Language;
}

export const InstitutionAwarenessReport: React.FC<InstitutionAwarenessReportProps> = () => {
  const hardwareCount = SCHEMES_DATABASE.filter((s) => s.hardware_delivered !== null).length;
  const generalCount = SCHEMES_DATABASE.length - hardwareCount;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <Building2 className="w-3.5 h-3.5" />
          <span>Institutional Welfare Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          School & College Government Benefits Awareness Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Aggregated directory metrics across all 52 Maharashtra Departmental & Central Scholarship schemes and 7 digital device distribution initiatives.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Statutory Schemes</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">59</div>
          <div className="text-[11px] text-emerald-600 font-semibold pt-1">
            52 General + 7 Hardware Schemes
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Active Hardware Programs</div>
          <div className="text-3xl font-bold text-amber-600 tabular-nums">7</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Tablets, Laptops & Screen-Readers
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Departments Covered</div>
          <div className="text-3xl font-bold text-indigo-600 tabular-nums">11</div>
          <div className="text-[11px] text-slate-500 pt-1">
            DHE, DTE, SJSA, TRTI, BMC, AICTE
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Targeted Beneficiaries</div>
          <div className="text-3xl font-bold text-emerald-600 tabular-nums">100%</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Open/EBC, SC, ST, VJNT, OBC, PwD
          </div>
        </div>
      </div>

      {/* Directives */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Statutory Directives for College Scholarship Desks (MahaDBT & NSP)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900">1. Strict Time-Bound Scrutiny</h4>
            <p className="text-slate-600">
              Institutions must scrutinize student forms within 10 days of online submission on the MahaDBT and NSP portals. Rejecting applications without explicit deficiency remarks is strictly prohibited by government circular.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900">2. Document Re-upload Facility</h4>
            <p className="text-slate-600">
              If an income or caste validity certificate is illegible, the institution must use the "Document Re-upload" query status rather than outright rejection, allowing the student 7 days to provide a legible scan.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900">3. Aadhaar-Bank Account Seeding (DBT)</h4>
            <p className="text-slate-600">
              Colleges must conduct special awareness camps ensuring every enrolled scholar has an active NPCI Aadhaar-seeded bank account to eliminate DBT disbursement failures.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900">4. Digital Device Asset Registry</h4>
            <p className="text-slate-600">
              Institutions facilitating Mahajyoti, BARTI, or TRTI tablet and laptop distributions must maintain a physical handover register signed by the student and principal, with IMEI numbers logged for audit inspections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
