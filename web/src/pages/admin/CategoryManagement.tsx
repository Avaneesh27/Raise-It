import React, { useEffect, useState } from 'react';
import { Tags, Plus, RefreshCw, Sliders } from 'lucide-react';
import { adminApi } from '../../services/api';
import { IssueCategory, Department } from '../../types';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, deptRes] = await Promise.all([
        adminApi.getCategories(),
        adminApi.getDepartments()
      ]);
      setCategories(catRes.data.categories || []);
      setDepartments(deptRes.data.departments || []);
    } catch (err) {
      console.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateWeight = async (id: string, basePriorityWeight: number) => {
    try {
      await adminApi.updateCategory(id, { basePriorityWeight });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update priority weight');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Issue Categories & Priority Weights</h2>
          <p className="text-sm text-slate-400">
            Map civic categories to responsible municipal departments and tune base priority weights (PRD Section 56)
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
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Internal Key</th>
              <th className="py-3.5 px-4">Responsible Department</th>
              <th className="py-3.5 px-4">Base Priority Weight (0-40)</th>
              <th className="py-3.5 px-4 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {categories.map((c) => (
              <tr key={c._id} className="hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">{c.name}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{c.key}</td>
                <td className="py-3 px-4 text-slate-300">
                  {typeof c.departmentId === 'object' ? c.departmentId?.name : 'Assigned Board'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white w-6">{c.basePriorityWeight}</span>
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(c.basePriorityWeight / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => handleUpdateWeight(c._id, Math.max(10, c.basePriorityWeight - 5))}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleUpdateWeight(c._id, Math.min(40, c.basePriorityWeight + 5))}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                  >
                    +5
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
