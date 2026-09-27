import React, { useState, useMemo } from 'react';
import { GuidanceRequest, Language, AuthUser, Scheme } from '../types';
import { SCHEMES_DATABASE } from '../data/schemesData';
import { DOCUMENTS_DATA } from '../data/documentsData';
import { TRANSLATIONS } from '../data/translations';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  FileText,
  UserCheck,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Laptop,
  ShieldAlert,
  ArrowRight,
  Inbox
} from 'lucide-react';

interface TeacherGuidanceDashboardProps {
  language: Language;
  currentUser: AuthUser | null;
  requests: GuidanceRequest[];
  onUpdateRequestStatus: (
    requestId: string,
    newStatus: 'pending' | 'approved' | 'rejected' | 'document_reupload_requested',
    teacherNotes: string
  ) => void;
  onOpenSchemeModal?: (scheme: Scheme) => void;
  onNavigateToStudentDashboard?: () => void;
}

export const TeacherGuidanceDashboard: React.FC<TeacherGuidanceDashboardProps> = ({
  language,
  currentUser,
  requests,
  onUpdateRequestStatus,
  onOpenSchemeModal,
  onNavigateToStudentDashboard
}) => {
  const t = TRANSLATIONS[language];
  const isTeacherOrAdmin =
    currentUser?.role === 'teacher' ||
    currentUser?.role === 'counsellor' ||
    currentUser?.role === 'system_admin';

  // Strict Role Protection Guard
  if (!isTeacherOrAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-xs max-w-xl mx-auto my-12 animate-in">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
          {t.roleProtectedNotice}
        </p>
        <button
          type="button"
          onClick={onNavigateToStudentDashboard}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <span>{t.returnToStudentDashboard}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('all');

  // Modal for review action
  const [activeRequest, setActiveRequest] = useState<GuidanceRequest | null>(null);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | 'document_reupload_requested' | null>(null);
  const [teacherNotesInput, setTeacherNotesInput] = useState('');
  const [viewDetailModal, setViewDetailModal] = useState<GuidanceRequest | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const approved = requests.filter((r) => r.status === 'approved').length;
    const rejected = requests.filter((r) => r.status === 'rejected').length;
    const reupload = requests.filter((r) => r.status === 'document_reupload_requested').length;
    const strictlyCompliant = requests.filter((r) => r.strict_compliance_check).length;
    return { total, pending, approved, rejected, reupload, strictlyCompliant };
  }, [requests]);

  // Unique schemes present in requests
  const uniqueSchemes = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      map.set(r.scheme_id, r.scheme_title);
    });
    return Array.from(map.entries());
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.scheme_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.request_message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || req.student_category.toUpperCase() === categoryFilter.toUpperCase();
      const matchesScheme = selectedSchemeFilter === 'all' || req.scheme_id === selectedSchemeFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesScheme;
    });
  }, [requests, searchTerm, statusFilter, categoryFilter, selectedSchemeFilter]);

  const handleOpenActionModal = (req: GuidanceRequest, type: 'approved' | 'rejected' | 'document_reupload_requested') => {
    setActiveRequest(req);
    setActionType(type);
    if (type === 'approved') {
      setTeacherNotesInput('Documents and strict eligibility verified. Application endorsed for institutional approval.');
    } else if (type === 'rejected') {
      setTeacherNotesInput('Does not satisfy statutory criteria for the requested scheme.');
    } else {
      setTeacherNotesInput('Please re-upload a clear copy of your Income Certificate and valid Caste Scrutiny/NCL certificate.');
    }
  };

  const handleConfirmAction = () => {
    if (!activeRequest || !actionType) return;
    onUpdateRequestStatus(activeRequest.id, actionType, teacherNotesInput);
    setActiveRequest(null);
    setActionType(null);
    setTeacherNotesInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Matching image's sleek dark slate style */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Teacher & Nodal Officer Guidance Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.tabTeacherDashboard}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Review and audit student scheme applications, guidance requests, and hardware device entitlements with automated criteria compliance checking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Logged in Officer</div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {currentUser?.name || 'Prof. Arvind Deshmukh'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 font-medium">Total Inbox</div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-1 tabular-nums">{stats.total}</div>
          </div>
          <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
            <div className="text-[11px] text-amber-300 font-medium">Pending Review</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 tabular-nums">{stats.pending}</div>
          </div>
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl">
            <div className="text-[11px] text-emerald-300 font-medium">Approved</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{stats.approved}</div>
          </div>
          <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
            <div className="text-[11px] text-rose-300 font-medium">Rejected</div>
            <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 tabular-nums">{stats.rejected}</div>
          </div>
          <div className="bg-blue-950/30 border border-blue-800/40 p-3 rounded-xl">
            <div className="text-[11px] text-blue-300 font-medium">Doc Re-upload</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-400 mt-1 tabular-nums">{stats.reupload}</div>
          </div>
          <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl">
            <div className="text-[11px] text-purple-300 font-medium">Strictly Compliant</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-400 mt-1 tabular-nums">{stats.strictlyCompliant}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Clean style from image */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Student Name, ID, Scheme..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
            >
              <option value="all">Status: All Requests ({requests.length})</option>
              <option value="pending">Pending Review ({stats.pending})</option>
              <option value="approved">Approved ({stats.approved})</option>
              <option value="rejected">Rejected ({stats.rejected})</option>
              <option value="document_reupload_requested">Document Re-upload Requested ({stats.reupload})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer"
            >
              <option value="all">Category: All Categories</option>
              <option value="OPEN">OPEN</option>
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

          {/* Scheme Filter */}
          <div>
            <select
              value={selectedSchemeFilter}
              onChange={(e) => setSelectedSchemeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white text-slate-800 cursor-pointer truncate"
            >
              <option value="all">Schemes: All Applied Schemes</option>
              {uniqueSchemes.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-800">{filteredRequests.length}</strong> student requests
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Strict Match Passed
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Criteria Discrepancy Found
            </span>
          </div>
        </div>
      </div>

      {/* Requests Table or Empty State (Only keeps data students submit) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="text-base font-bold text-slate-900">No Student Requests Yet</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              When students click "Ask Query / Send Request" on any scheme card, their application dossiers will appear here for document verification and approval.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Student & ID</th>
                  <th className="py-3.5 px-4">Class & Stream</th>
                  <th className="py-3.5 px-4">Category & Income</th>
                  <th className="py-3.5 px-4">Applied Scheme / Opportunity</th>
                  <th className="py-3.5 px-4 text-center">Strict Compliance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student Info */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-slate-900 text-xs">{req.student_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {req.student_id}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Submitted: {req.created_at.split(' ')[0]}</div>
                    </td>

                    {/* Class & Stream */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-semibold text-slate-800">{req.student_class}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{req.student_stream}</div>
                      <div className="text-[10px] text-indigo-700 font-bold mt-1">
                        Marks: {req.student_percentage}%
                      </div>
                    </td>

                    {/* Category & Income */}
                    <td className="py-4 px-4 align-top">
                      <div className="inline-flex px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                        {req.student_category}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-1">
                        ₹{req.student_income.toLocaleString('en-IN')} / Yr
                      </div>
                    </td>

                    {/* Applied Scheme */}
                    <td className="py-4 px-4 align-top max-w-xs">
                      <div className="font-bold text-slate-900 leading-snug line-clamp-2">
                        {req.scheme_title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {req.scheme_department}
                      </div>

                      {req.hardware_delivered && (
                        <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Laptop className="w-3 h-3 text-amber-600" />
                          <span>{req.hardware_delivered}</span>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-600 mt-1 line-clamp-2 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                        "{req.request_message}"
                      </div>
                    </td>

                    {/* Strict Compliance Engine Check */}
                    <td className="py-4 px-4 align-top text-center">
                      {req.strict_compliance_check ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Strictly Eligible</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 mt-1 font-medium">100% Rules Passed</span>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Criteria Gap</span>
                          </span>
                          <span className="text-[10px] text-amber-800 mt-1 font-medium">Scrutiny Required</span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 align-top">
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending Review
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Approved
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Rejected
                        </span>
                      )}
                      {req.status === 'document_reupload_requested' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                          Doc Re-upload
                        </span>
                      )}

                      {req.teacher_notes && (
                        <div className="mt-1 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded border border-slate-200 max-w-[180px]">
                          <strong>Teacher Note:</strong> {req.teacher_notes}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right space-y-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setViewDetailModal(req)}
                        className="w-full px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>View Dossier</span>
                      </button>

                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(req, 'approved')}
                          className="px-2 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer shadow-2xs"
                          title="Approve student request"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(req, 'document_reupload_requested')}
                          className="px-2 py-1 text-[11px] font-bold text-slate-700 bg-amber-100 hover:bg-amber-200 rounded transition-colors cursor-pointer"
                          title="Request student to re-upload documents"
                        >
                          Re-upload
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(req, 'rejected')}
                          className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors cursor-pointer shadow-2xs"
                          title="Reject request"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Dialog Modal */}
      {activeRequest && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {actionType === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {actionType === 'rejected' && <XCircle className="w-5 h-5 text-rose-600" />}
                {actionType === 'document_reupload_requested' && <RotateCcw className="w-5 h-5 text-amber-600" />}
                <h3 className="text-base font-bold text-slate-900">
                  {actionType === 'approved' && 'Approve Scheme Request'}
                  {actionType === 'rejected' && 'Reject Scheme Request'}
                  {actionType === 'document_reupload_requested' && 'Request Document Re-upload'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveRequest(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div>
                  <strong>Student:</strong> {activeRequest.student_name} ({activeRequest.student_id})
                </div>
                <div>
                  <strong>Scheme:</strong> {activeRequest.scheme_title}
                </div>
                <div>
                  <strong>Category / Income:</strong> {activeRequest.student_category} · ₹
                  {activeRequest.student_income.toLocaleString('en-IN')}
                </div>
                <div>
                  <strong>Compliance Check:</strong>{' '}
                  {activeRequest.strict_compliance_check ? (
                    <span className="text-emerald-700 font-bold">Passed 100% of Statutory Parameters</span>
                  ) : (
                    <span className="text-amber-800 font-bold">Rule Discrepancy Found in Profile</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Teacher Notes & Guidance Remarks:
                </label>
                <textarea
                  rows={4}
                  value={teacherNotesInput}
                  onChange={(e) => setTeacherNotesInput(e.target.value)}
                  placeholder="Enter specific remarks, reasons for decision, or document guidance for the student..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActiveRequest(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg cursor-pointer shadow-xs transition-colors ${
                  actionType === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'rejected'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm {actionType === 'approved' ? 'Approval' : actionType === 'rejected' ? 'Rejection' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dossier Detail Modal */}
      {viewDetailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 animate-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Student Verification Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-900">{viewDetailModal.student_name}</h3>
                <p className="text-xs text-slate-500">
                  Student ID: {viewDetailModal.student_id} · Applied for {viewDetailModal.scheme_title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Profile Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">CATEGORY</span>
                <span className="font-bold text-slate-800">{viewDetailModal.student_category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">ANNUAL INCOME</span>
                <span className="font-bold text-slate-800">₹{viewDetailModal.student_income.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">CLASS & STREAM</span>
                <span className="font-bold text-slate-800">{viewDetailModal.student_class} ({viewDetailModal.student_stream})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold">QUALIFYING MARKS</span>
                <span className="font-bold text-indigo-700">{viewDetailModal.student_percentage}%</span>
              </div>
            </div>

            {/* Student Statement */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Student's Statement:</label>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 italic">
                "{viewDetailModal.request_message}"
              </div>
            </div>

            {/* Compliance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict Database Verification Check</span>
                </label>
                {viewDetailModal.strict_compliance_check ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All Statutory Criteria Met
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Review Required
                  </span>
                )}
              </div>
            </div>

            {/* Attached Statutory Documents */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Attached Documents ({viewDetailModal.attached_documents.length}):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {viewDetailModal.attached_documents.map((docId) => {
                  const docInfo = DOCUMENTS_DATA[docId];
                  return (
                    <div
                      key={docId}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2 text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">{docInfo ? docInfo.name : docId}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {docInfo ? docInfo.issuingAuthority : 'Authority verified'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Notes History */}
            {viewDetailModal.teacher_notes && (
              <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-700">Existing Action Note:</div>
                <div className="text-slate-600">{viewDetailModal.teacher_notes}</div>
                {viewDetailModal.reviewed_at && (
                  <div className="text-[10px] text-slate-400 mt-1">Updated on: {viewDetailModal.reviewed_at}</div>
                )}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              {onOpenSchemeModal && (
                <button
                  type="button"
                  onClick={() => {
                    const sc = SCHEMES_DATABASE.find((s) => s.id === viewDetailModal.scheme_id);
                    if (sc) onOpenSchemeModal(sc);
                  }}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Scheme Master SOP</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setViewDetailModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const req = viewDetailModal;
                    setViewDetailModal(null);
                    handleOpenActionModal(req, 'approved');
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer shadow-2xs"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
