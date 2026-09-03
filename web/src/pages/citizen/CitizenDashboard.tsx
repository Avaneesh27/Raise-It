import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Plus,
  Camera,
  Upload,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Bot,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  Trophy,
  Award
} from 'lucide-react';
import { citizenApi } from '../../services/api';
import { CitizenReportDetailsModal } from '../../components/citizen/CitizenReportDetailsModal';

export const CitizenDashboard: React.FC = () => {
  const { user, onOpenReportModal, onOpenAssistant } = useOutletContext<{
    user: any;
    onOpenReportModal: () => void;
    onOpenAssistant: (reportId?: string) => void;
  }>();

  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [myReports, setMyReports] = useState<any[]>([]);
  const [nearbyIssues, setNearbyIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch my reports
      const myRes = await citizenApi.getMyReports();
      setMyReports(myRes.data.reports || []);

      // Fetch nearby issues
      const nearbyRes = await citizenApi.getNearbyReports(79.0882, 21.1458, 5000);
      setNearbyIssues(nearbyRes.data.reports || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredReports = myReports.filter((r) =>
    activeTab === 'active' ? r.status !== 'RESOLVED' : r.status === 'RESOLVED'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Welcome & Location Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131b2e] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Verified Citizen
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hello, {user?.name || 'Citizen'}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user?.address || 'Ward 12, Civil Lines, Nagpur'}</span>
          </div>
        </div>

        {/* Primary CTA: + Report a Problem */}
        <Link
          to="/citizen/report"
          className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>+ Report a Problem</span>
        </Link>
      </div>

      {/* 2. Direct Camera / Upload Quick Launcher Banner (PRD Section 9) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
            <Camera className="w-3.5 h-3.5" />
            <span>Instant Mobile Reporting</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Notice a civic defect in your area?
          </h2>
          <p className="text-sm text-emerald-50 leading-relaxed font-normal">
            Take a photo, attach your location, and let RaiseIt automatically verify the problem, detect recurring clusters, and alert your ward engineer.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/citizen/report"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Capture / Upload Photo</span>
            </Link>
            <button
              onClick={() => onOpenAssistant()}
              className="px-5 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700/80 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Ask Civic Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. My Reports & Nearby Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): My Reports */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              My Grievance Reports
            </h3>

            {/* Active vs Resolved Segmented Tab */}
            <div className="flex bg-slate-100 dark:bg-[#131b2e] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'active'
                    ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Active Complaints ({myReports.filter((r) => r.status !== 'RESOLVED').length})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'resolved'
                    ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Resolved Archive ({myReports.filter((r) => r.status === 'RESOLVED').length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">Loading your reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No {activeTab} reports found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'active'
                  ? 'You currently have no active complaints lodged. Spot an issue? Report it now.'
                  : 'You have no resolved reports in your historical archive.'}
              </p>
              {activeTab === 'active' && (
                <Link
                  to="/citizen/report"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition"
                >
                  + Lodge First Report
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => setSelectedReportId(report.reportId)}
                  className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer shadow-sm hover:shadow transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={report.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'}
                      alt={report.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                          #{report.reportId}
                        </span>
                        {report.isRecurring && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <Flame className="w-3 h-3" />
                            Cluster Hotspot
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {report.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="capitalize">{report.categoryName?.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        report.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : report.status === 'ASSIGNED'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {report.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Nearby Issues & RAG Assistant */}
        <div className="lg:col-span-4 space-y-6">
          {/* Civic Assistant Quick Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                RAG Civic Assistant
              </h4>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Have questions about municipal resolution timelines, pothole SLAs, or citizen rights?
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => onOpenAssistant()}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#0d1322] hover:bg-slate-100 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition flex items-center justify-between"
              >
                <span>"What happens after submitting?"</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => onOpenAssistant()}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#0d1322] hover:bg-slate-100 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition flex items-center justify-between cursor-pointer"
              >
                <span>"What is the pothole repair SLA?"</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Badges & Achievements Quick Widget */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Civic Badges &amp; XP
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {myReports.length * 25} Contribution Points
                  </span>
                </div>
              </div>
              <Link
                to="/citizen/badges"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Earn recognition levels and community badges for reporting verifiable defects in your ward.
            </p>
          </div>

          {/* Nearby Neighborhood Issues */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Nearby Issues in Ward 12
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Within 500m</span>
            </div>

            {nearbyIssues.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No active nearby complaints.</p>
            ) : (
              <div className="space-y-2.5">
                {nearbyIssues.slice(0, 3).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedReportId(item.reportId)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0d1322] border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500/30 cursor-pointer transition space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                        {item.categoryName?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
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
