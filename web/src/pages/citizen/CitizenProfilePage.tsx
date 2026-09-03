import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Sun,
  Moon,
  LogOut,
  FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const CitizenProfilePage: React.FC = () => {
  const { user } = useOutletContext<{ user: any }>();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        Citizen Profile
      </h1>

      {/* User Card */}
      <div className="bg-white dark:bg-[#131b2e] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-3xl shrink-0">
          {user?.name?.charAt(0) || 'C'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1">
            <Shield className="w-3 h-3" />
            <span>VERIFIED CITIZEN ACCOUNT</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{user?.name || 'Citizen'}</h2>
          <div className="text-xs text-slate-500 flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || 'citizen@example.com'}
            </span>
            {user?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {user.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ward & Address Information */}
      <div className="bg-white dark:bg-[#131b2e] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Registered Municipal Zone</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Jurisdiction:</span>
            <span className="font-bold text-slate-900 dark:text-white">Ward 12, Civil Lines Division</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Municipal Corporation:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Nagpur Municipal Corporation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account ID:</span>
            <span className="font-mono text-slate-500">{user?.id || user?._id || 'CIT-88219'}</span>
          </div>
        </div>
      </div>

      {/* Preferences & System Settings */}
      <div className="bg-white dark:bg-[#131b2e] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Preferences
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-purple-400" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Day / Night Theme</div>
              <div className="text-[11px] text-slate-500">Current mode: {theme.toUpperCase()}</div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};
