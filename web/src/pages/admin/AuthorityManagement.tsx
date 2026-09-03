import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, XCircle, RefreshCw, Building2 } from 'lucide-react';
import { adminApi } from '../../services/api';
import { User, Department } from '../../types';

export const AuthorityManagement: React.FC = () => {
  const [authorities, setAuthorities] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [authRes, deptRes] = await Promise.all([
        adminApi.getAuthorities(),
        adminApi.getDepartments()
      ]);
      setAuthorities(authRes.data.authorities || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      console.error('Error fetching authorities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: string, departmentId?: string) => {
    try {
      await adminApi.updateAuthority(id, { status, departmentId });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update authority');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Authority Account Management</h2>
          <p className="text-sm text-slate-400">
            Verify official accounts, assign department jurisdictions, and approve pending requests (PRD Section 54)
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Officer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {authorities.map((auth) => (
                <tr key={auth._id || auth.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-slate-200">{auth.name}</td>
                  <td className="py-3 px-4 text-slate-400">{auth.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={auth.department?._id || auth.departmentId || ''}
                      onChange={(e) => handleStatusChange(auth._id || auth.id, auth.status, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Unassigned</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        auth.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : auth.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {auth.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {auth.status === 'PENDING' ? (
                      <button
                        onClick={() => handleStatusChange(auth._id || auth.id, 'ACTIVE')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Approve
                      </button>
                    ) : auth.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleStatusChange(auth._id || auth.id, 'INACTIVE')}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(auth._id || auth.id, 'ACTIVE')}
                        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Activate
                      </button>
                    )}
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
