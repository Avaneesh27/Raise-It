import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  Filter,
  Plus,
  Flame,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin
} from 'lucide-react';
import { citizenApi } from '../../services/api';
import { CitizenReportDetailsModal } from '../../components/citizen/CitizenReportDetailsModal';

export const CitizenReportsPage: React.FC = () => {
  const { onOpenReportModal, onOpenAssistant } = useOutletContext<{
    onOpenReportModal: () => void;
    onOpenAssistant: (reportId?: string) => void;
  }>();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    citizenApi
      .getMyReports()
      .then((res) => setReports(res.data.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.reportId?.toLowerCase().includes(search.toLowerCase()) ||
      r.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Civic Grievance Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track and audit all complaints lodged from your account
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Report New Issue</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-[#131b2e] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #RI, defect title, or landmark..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Report Cards List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading complaints...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No complaints found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or report a new civic issue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <div
              key={report._id}
              onClick={() => setSelectedReportId(report.reportId)}
              className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer shadow-sm hover:shadow transition flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={report.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'}
                  alt={report.title}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-900 shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                      #{report.reportId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {report.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{report.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <CitizenReportDetailsModal
        reportId={selectedReportId}
        onClose={() => setSelectedReportId(null)}
        onOpenAssistant={(reportId) => {
          setSelectedReportId(null);
          onOpenAssistant(reportId);
        }}
      />
    </div>
  );
};
