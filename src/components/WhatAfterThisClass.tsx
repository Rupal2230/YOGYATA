import React, { useState } from 'react';
import { Language, Scheme } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { SCHEMES_DATABASE } from '../data/schemesData';
import {
  Compass,
  ArrowRight,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileText,
  Sparkles
} from 'lucide-react';

interface WhatAfterThisClassProps {
  language: Language;
  onSelectScheme: (scheme: Scheme) => void;
}

export const WhatAfterThisClass: React.FC<WhatAfterThisClassProps> = ({
  language,
  onSelectScheme
}) => {
  const t = TRANSLATIONS[language];
  const [selectedStage, setSelectedStage] = useState<'10th' | '12th' | 'ug'>('12th');

  const pathways = {
    '10th': {
      title: 'After Class 10 (SSC)',
      routes: [
        {
          heading: 'Junior College (11th & 12th Science / Commerce / Arts)',
          description: 'Enroll in 11th & 12th standard for foundational competitive and state board training.',
          recommendedSchemeIds: ['sch-07', 'sch-29', 'hw-01', 'hw-02', 'hw-03']
        },
        {
          heading: 'Polytechnic Engineering Diploma (MSBTE)',
          description: '3-Year direct industry and technical diploma admission via centralized CAP round.',
          recommendedSchemeIds: ['sch-01', 'sch-02', 'sch-41', 'sch-42']
        },
        {
          heading: 'Craftsman Training / ITI Programs (DVET)',
          description: 'Hands-on skill trades with 100% government trade fee reimbursement.',
          recommendedSchemeIds: ['sch-40', 'sch-49']
        }
      ]
    },
    '12th': {
      title: 'After Class 12 (HSC)',
      routes: [
        {
          heading: 'Engineering & Technical Degree (B.Tech / BE)',
          description: 'Admission via MHT-CET / JEE Mains through Centralized State CAP rounds.',
          recommendedSchemeIds: ['sch-01', 'sch-02', 'sch-41', 'sch-42', 'sch-46', 'hw-07']
        },
        {
          heading: 'Health Sciences & Medical (MBBS, BDS, BAMS, BSc Nursing)',
          description: 'Admission through NEET UG state merit quota under DMER Maharashtra.',
          recommendedSchemeIds: ['sch-31', 'sch-32']
        },
        {
          heading: 'Agriculture & Allied Sciences (MCAER / State Agri Universities)',
          description: 'B.Sc Agriculture, Horticulture, Forestry, Agri-Biotechnology courses.',
          recommendedSchemeIds: ['sch-37', 'sch-38']
        },
        {
          heading: 'Pure Sciences & Merit Fellowships (B.Sc)',
          description: 'Research foundation in Mathematics, Physics, Chemistry with DST INSPIRE support.',
          recommendedSchemeIds: ['sch-04', 'sch-05', 'sch-45']
        }
      ]
    },
    ug: {
      title: 'After Graduation (Bachelors)',
      routes: [
        {
          heading: 'Postgraduate Higher Education (M.Tech, M.Sc, MA, MBA)',
          description: 'Master degrees with Eklavya, Post-Matric, and RCSM state fee reimbursements.',
          recommendedSchemeIds: ['sch-01', 'sch-03', 'sch-09', 'sch-17', 'sch-23', 'sch-25', 'sch-27']
        },
        {
          heading: 'Doctoral Research Fellowships (Ph.D.)',
          description: 'CSMNRF, BANRF, BARTI, SARTHI, and Mahajyoti fellowship assistance (₹31,000+/Mo).',
          recommendedSchemeIds: ['sch-52']
        },
        {
          heading: 'World Top 100 QS Universities Overseas Scholarships',
          description: '100% full foreign funding for Master / Ph.D. degrees in premier global universities.',
          recommendedSchemeIds: ['sch-14', 'sch-22', 'sch-30']
        },
        {
          heading: 'Youth Industrial Training & Apprenticeships',
          description: 'Mukhyamantri Yuva Karya Prashikshan Yojana with monthly government stipend.',
          recommendedSchemeIds: ['sch-49']
        }
      ]
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
          <Compass className="w-3.5 h-3.5" />
          <span>Academic Stage Progression Map</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t.tabAfterClass}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Explore structured government scheme pathways and funding entitlements as you graduate from 10th Standard, 12th Standard, or complete your Bachelor's degree.
        </p>
      </div>

      {/* Stage Selector */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setSelectedStage('10th')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedStage === '10th'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Class 10 (SSC) Completed
        </button>
        <button
          type="button"
          onClick={() => setSelectedStage('12th')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedStage === '12th'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Class 12 (HSC) Completed
        </button>
        <button
          type="button"
          onClick={() => setSelectedStage('ug')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedStage === 'ug'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Undergraduate Degree Completed
        </button>
      </div>

      {/* Pathway Cards */}
      <div className="space-y-4">
        {pathways[selectedStage].routes.map((route, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>{route.heading}</span>
              </h3>
              <p className="text-xs text-slate-600 pl-8">{route.description}</p>
            </div>

            <div className="pl-8 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Recommended Statutory Funding Schemes:
              </span>
              <div className="flex flex-wrap gap-2">
                {route.recommendedSchemeIds.map((schId) => {
                  const s = SCHEMES_DATABASE.find((item) => item.id === schId);
                  if (!s) return null;
                  return (
                    <button
                      key={schId}
                      type="button"
                      onClick={() => onSelectScheme(s)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-800 text-xs font-semibold border border-slate-200 hover:border-amber-300 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate max-w-xs">{s.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
