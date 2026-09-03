import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { authorityApi } from '../../services/api';
import { IssueReport } from '../../types';

export const IssueList: React.FC = () => {
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isRecurring, setIsRecurring] = useState('');
  const [sort, setSort] = useState('priority');

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params: any = { sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (isRecurring) params.isRecurring = isRecurring;

      const res = await authorityApi.getIssues(params);
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error('Failed to load issues', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, priority, isRecurring, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complaints Queue</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Filter, search, prioritize, and manage citizen grievances</p>
        </div>
        <button
          onClick={fetchIssues}
          className="flex items-center space-x-2 bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-[#1c2744] border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Report ID (#RI1001), address, description..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage</option>
              <option value="streetlight">Streetlight</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="drainage">Drainage</option>
              <option value="damaged_infrastructure">Damaged Infra</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Recurring</label>
            <select
              value={isRecurring}
              onChange={(e) => setIsRecurring(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Reports</option>
              <option value="true">Recurring Clusters Only</option>
              <option value="false">Isolated Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="priority">Priority (Highest First)</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      {/* Table Container */}
      <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0d1322] text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Evidence</th>
                <th className="py-3.5 px-4">Issue & AI Confidence</th>
                <th className="py-3.5 px-4">Location Address</th>
                <th className="py-3.5 px-4">Recurrence</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{issue.reportId}
                  </td>
                  <td className="py-3 px-4">
                    <img
                      src={issue.imageUrl}
                      alt={issue.categoryName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=100';
                      }}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white capitalize">
                      {issue.categoryName.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      AI Conf: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{Math.round(issue.aiConfidence * 100)}%</span>
                      {issue.isCategoryOverridden && (
                        <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">User Overridden</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-slate-800 dark:text-slate-200 truncate font-medium">{issue.address}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      [{issue.location.coordinates[1].toFixed(4)}, {issue.location.coordinates[0].toFixed(4)}]
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {issue.isRecurring ? (
                      <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        <Flame className="w-3 h-3" />
                        <span>Recurring ({issue.nearbyReportCount})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Isolated</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        issue.priorityLevel === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : issue.priorityLevel === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {issue.priorityLevel} ({issue.priorityScore})
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={location.pathname.startsWith('/admin') ? `/admin/issues/${issue.reportId}` : `/authority/issues/${issue.reportId}`}
                      className="inline-flex items-center space-x-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/30 px-3 py-1.5 rounded-xl font-medium transition"
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

        {issues.length === 0 && !loading && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No complaints found matching the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
