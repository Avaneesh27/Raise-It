import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Eye,
  Building2
} from 'lucide-react';
import { authorityApi } from '../../services/api';
import { IssueReport } from '../../types';

export const AuthorityDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentIssues, setRecentIssues] = useState<IssueReport[]>([]);
  const [priorityClusters, setPriorityClusters] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await authorityApi.getDashboard();
      setStats(res.data.stats);
      setRecentIssues(res.data.recentIssues || []);
      setPriorityClusters(res.data.priorityClusters || []);
    } catch (err: any) {
      console.error('Error fetching dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'Total Assigned', value: stats?.total || 0, icon: Layers, color: 'from-blue-600 to-indigo-600' },
    { label: 'Pending / Submitted', value: stats?.submitted || 0, icon: Clock, color: 'from-amber-600 to-orange-600' },
    { label: 'Under Review', value: stats?.underReview || 0, icon: RefreshCw, color: 'from-sky-600 to-cyan-600' },
    { label: 'In Progress', value: stats?.inProgress || 0, icon: TrendingUp, color: 'from-violet-600 to-purple-600' },
    { label: 'Resolved Tickets', value: stats?.resolved || 0, icon: CheckCircle2, color: 'from-emerald-600 to-teal-600' },
    { label: 'High Priority Alert', value: stats?.highPriority || 0, icon: Flame, color: 'from-rose-600 to-red-600' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Authority Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Department complaint queue, recurring hotspots, and field operations
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center space-x-2 bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-[#1c2744] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${c.color} opacity-10 rounded-bl-full pointer-events-none`} />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{c.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${c.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '-' : c.value}</div>
            </div>
          );
        })}
      </div>

      {/* Priority Recurring Clusters Spotlight (PRD Section 43 & 49) */}
      <div className="bg-white dark:bg-[#131b2e] border border-rose-500/30 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Recurring Issue Hotspots</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Geospatial clusters of similar civic issues within 500m radius</p>
            </div>
          </div>
          <Link
            to="/authority/priority-locations"
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold flex items-center space-x-1"
          >
            <span>View All Hotspots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {priorityClusters.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No active recurring issue clusters in your department queue.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {priorityClusters.map((cluster) => (
              <div
                key={cluster._id}
                className="bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-md">
                      {cluster.categoryName} Cluster
                    </span>
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {cluster.nearbyReportCount + 1} Reports
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{cluster.address}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cluster.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">#{cluster.reportId}</span>
                  <Link
                    to={`/authority/issues/${cluster.reportId}`}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Assigned Issues */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Recent Department Complaints</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Newly assigned civic tickets requiring verification or action</p>
          </div>
          <Link
            to="/authority/issues"
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center space-x-1"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0d1322] text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">AI Conf.</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {recentIssues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{issue.reportId}
                  </td>
                  <td className="py-3 px-4 font-semibold capitalize text-slate-900 dark:text-white">
                    {issue.categoryName.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                      {(issue.aiConfidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate text-slate-500">
                    {issue.address}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        issue.priorityLevel === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : issue.priorityLevel === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {issue.priorityLevel} ({issue.priorityScore})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/authority/issues/${issue.reportId}`}
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
