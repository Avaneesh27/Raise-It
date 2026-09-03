import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Flame, AlertTriangle, ArrowRight, RefreshCw, Calendar } from 'lucide-react';
import { authorityApi } from '../../services/api';
import { IssueReport } from '../../types';

export const PriorityLocations: React.FC = () => {
  const [clusters, setClusters] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const res = await authorityApi.getPriorityLocations();
      setClusters(res.data.clusters || []);
    } catch (err) {
      console.error('Failed to load priority locations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Recurring Priority Hotspots</h2>
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
              AI & Proximity Analysis
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Locations where repeated civic grievances occur within configured 500-meter radius (PRD Section 49)
          </p>
        </div>

        <button
          onClick={fetchClusters}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Hotspots</span>
        </button>
      </div>

      {/* Clusters Grid */}
      {clusters.length === 0 && !loading ? (
        <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <MapPin className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Recurring Clusters</h3>
          <p className="text-xs text-slate-500 mt-1">
            All complaints currently in the database are isolated or resolved.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map((c) => (
            <div
              key={c._id}
              className="bg-white dark:bg-[#131b2e] border border-rose-500/20 hover:border-rose-500/40 rounded-3xl p-6 shadow-sm relative overflow-hidden transition flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/5 rounded-bl-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{c.categoryName.replace('_', ' ')} Cluster</span>
                  </span>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                    {c.priorityLevel} PRIORITY ({c.priorityScore})
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{c.address}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description}</p>

                {/* Cluster metrics */}
                <div className="mt-4 p-3 bg-slate-50 dark:bg-[#0d1322] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Repeated Reports:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.nearbyReportCount + 1} complaints within 500m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                      {c.location.coordinates[1].toFixed(4)}, {c.location.coordinates[0].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reported On:</span>
                    <span className="text-slate-700 dark:text-slate-300">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Primary Ticket #{c.reportId}</span>
                <Link
                  to={`/authority/issues/${c.reportId}`}
                  className="inline-flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                >
                  <span>Inspect Cluster</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
