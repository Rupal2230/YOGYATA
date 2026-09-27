import React, { useState } from 'react';
import { Scheme, Language, StudentSchemeTracking, StudentStatusOption } from '../types';
import { DOCUMENTS_DATA } from '../data/documentsData';
import { TRANSLATIONS } from '../data/translations';
import {
  X,
  Calendar,
  ExternalLink,
  Laptop,
  CheckCircle2,
  FileText,
  Clock,
  Send,
  Building,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Bookmark,
  Bell,
  MessageSquare
} from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  language: Language;
  tracking?: StudentSchemeTracking;
  onToggleDocumentReady?: (schemeId: string, docId: string) => void;
  onStatusChange?: (schemeId: string, status: StudentStatusOption) => void;
  onSubmitGuidanceRequest?: (scheme: Scheme, message: string) => void;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
  onSetReminder?: (scheme: Scheme) => void;
  hasReminder?: boolean;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  language,
  tracking,
  onToggleDocumentReady,
  onStatusChange,
  onSubmitGuidanceRequest,
  isSaved = false,
  onToggleSave,
  onSetReminder,
  hasReminder = false
}) => {
  if (!scheme) return null;

  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'sop' | 'docs' | 'guidance'>('sop');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const readySet = new Set(tracking?.readyDocuments || []);
  const isHardware = scheme.hardware_delivered !== null;

  const handleSendRequest = () => {
    if (onSubmitGuidanceRequest) {
      onSubmitGuidanceRequest(
        scheme,
        requestMessage || `Inquiry regarding verification and guidelines for ${scheme.title}`
      );
    }
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in flex flex-col max-h-[90vh]">
        {/* Header - matching image's dark slate */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {scheme.department}
              </span>
              {isHardware && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                  <Laptop className="w-3 h-3" />
                  <span>Physical Device Allotment</span>
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold leading-snug">{scheme.title}</h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span><strong>Category:</strong> {scheme.target_audience}</span>
              <span>•</span>
              <span><strong>{t.incomeLimit}:</strong> {scheme.income_limit_text}</span>
              <span>•</span>
              <span className="text-amber-400 font-bold"><strong>{t.deadline}:</strong> {scheme.deadline}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Reminder Button */}
            {onSetReminder && (
              <button
                type="button"
                onClick={() => onSetReminder(scheme)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  hasReminder
                    ? 'bg-amber-400 text-slate-900 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title={hasReminder ? t.reminderSet : t.setReminder}
              >
                <Bell className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark Button */}
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(scheme.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-amber-400 text-slate-900 border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title={isSaved ? t.saved : t.saveScheme}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-900' : ''}`} />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('sop')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'sop'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Application SOP (Online & Offline)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'docs'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.requiredDocs} ({scheme.required_documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guidance')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'guidance'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-3 h-3 text-amber-600" />
            <span>{t.requestGuidance}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {/* TAB 1: Online and Offline SOP */}
          {activeTab === 'sop' && (
            <div className="space-y-6">
              {/* Hardware Box if applicable */}
              {isHardware && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <Laptop className="w-4 h-4 text-amber-700" />
                    <span>{t.hardwareDelivered}:</span>
                  </div>
                  <p className="text-amber-800 text-xs font-semibold">{scheme.hardware_delivered}</p>
                  <p className="text-[11px] text-amber-700 pt-1">
                    Statutory Rule: Government-issued devices carry asset tracking IMEI / serial numbers and are strictly non-transferable.
                  </p>
                </div>
              )}

              {/* Benefit Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">BENEFIT SUMMARY</span>
                <p className="text-sm font-bold text-slate-900">{scheme.benefit_details}</p>
              </div>

              {/* Online SOP */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">1</div>
                  <span>ONLINE OPERATIONAL PROTOCOL (SOP)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl whitespace-pre-line leading-relaxed text-xs text-slate-800 font-mono">
                  {scheme.online_sop}
                </div>
              </div>

              {/* Offline SOP */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</div>
                  <span>OFFLINE VERIFICATION & HANDOVER PROTOCOL (SOP)</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl whitespace-pre-line leading-relaxed text-xs text-slate-800 font-mono">
                  {scheme.offline_sop}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Documents Checklist */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Ensure you have verified original copies of the following statutory documents before appearing at the college scholarship scrutiny desk:
              </div>

              <div className="space-y-3">
                {scheme.required_documents.map((docId) => {
                  const docInfo = DOCUMENTS_DATA[docId];
                  const isReady = readySet.has(docId);

                  return (
                    <div
                      key={docId}
                      className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                        isReady ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            {docInfo ? docInfo.name : docId}
                          </span>
                          {docInfo && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                              {docInfo.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {docInfo ? docInfo.description : 'Statutory certificate for eligibility verification.'}
                        </p>
                        <div className="text-[10px] text-slate-400">
                          <strong>Issuing Authority:</strong> {docInfo ? docInfo.issuingAuthority : 'Competent Government Authority'}
                        </div>
                      </div>

                      {onToggleDocumentReady && (
                        <button
                          type="button"
                          onClick={() => onToggleDocumentReady(scheme.id, docId)}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                            isReady
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isReady ? 'Ready' : 'Mark Ready'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Request Teacher Guidance */}
          {activeTab === 'guidance' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-indigo-950">
                <div className="font-bold text-xs">Connect Directly with College Teacher / Nodal Officer</div>
                <p className="text-[11px] text-indigo-800">
                  {t.askTeacherSubtitle}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {t.optionalQueryLabel}
                </label>
                <textarea
                  rows={4}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="e.g. Respected Teacher, I have secured admission in this program. Could you please verify my certificates?"
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {requestSent ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.querySuccess}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendRequest}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.sendQueryButton}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <a
            href={scheme.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (onStatusChange) {
                onStatusChange(scheme.id, 'submitted_online');
              }
            }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <span>{t.applyDirectly} ({new URL(scheme.portal_url).hostname})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
