import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Tags,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats;

  const cards = [
    { label: 'Registered Citizens', value: stats?.totalCitizens || 0, icon: Users, color: 'from-blue-600 to-indigo-600', link: '/admin/issues' },
    { label: 'Department Authorities', value: stats?.totalAuthorities || 0, icon: ShieldCheck, color: 'from-emerald-600 to-teal-600', link: '/admin/authorities' },
    { label: 'Pending Approvals', value: stats?.pendingAuthorities || 0, icon: Clock, color: 'from-amber-600 to-orange-600', link: '/admin/authorities' },
    { label: 'Total City Complaints', value: stats?.totalIssues || 0, icon: ClipboardList, color: 'from-purple-600 to-pink-600', link: '/admin/issues' },
    { label: 'Active In-Flight Issues', value: stats?.activeIssues || 0, icon: Clock, color: 'from-cyan-600 to-blue-600', link: '/admin/issues' },
    { label: 'Resolved Tickets', value: stats?.resolvedIssues || 0, icon: CheckCircle2, color: 'from-emerald-600 to-green-600', link: '/admin/issues' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Municipal Administration Overview</h2>
          <p className="text-sm text-slate-400">
            System-wide platform oversight, authority verification, and knowledge base management
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              to={c.link}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden transition group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${c.color} opacity-10 rounded-bl-full pointer-events-none group-hover:scale-110 transition duration-300`} />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{c.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${c.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{loading ? '-' : c.value}</div>
            </Link>
          );
        })}
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/authorities"
          className="p-6 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Authority Approvals</h3>
            <p className="text-xs text-slate-400 mt-1">Review pending registrations and assign civic departments.</p>
          </div>
          <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center gap-1">
            <span>Manage Officers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/admin/departments"
          className="p-6 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Municipal Departments</h3>
            <p className="text-xs text-slate-400 mt-1">Configure Roads, Sanitation, Water, and Electrical boards.</p>
          </div>
          <div className="mt-4 text-xs font-semibold text-blue-400 flex items-center gap-1">
            <span>Configure Boards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="p-6 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
              <Tags className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Categories & Weights</h3>
            <p className="text-xs text-slate-400 mt-1">Tune priority scoring weights and department mappings.</p>
          </div>
          <div className="mt-4 text-xs font-semibold text-purple-400 flex items-center gap-1">
            <span>Tune Weights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/admin/knowledge-base"
          className="p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl transition flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Civic Knowledge Base</h3>
            <p className="text-xs text-slate-400 mt-1">Upload verified regulations and trigger RAG vector indexing.</p>
          </div>
          <div className="mt-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
            <span>Manage RAG Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>

      {/* Recent City-Wide Issues */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-white text-base mb-4">Recent City-Wide Complaints</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data?.recentIssues || []).map((issue: any) => (
                <tr key={issue._id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">#{issue.reportId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200 capitalize">{issue.categoryName.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-slate-400">{issue.assignedDepartmentId?.name || 'General'}</td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-xs">{issue.address}</td>
                  <td className="py-3 px-4 font-bold text-[10px] text-rose-400">{issue.priorityLevel}</td>
                  <td className="py-3 px-4 font-semibold text-slate-300">{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
