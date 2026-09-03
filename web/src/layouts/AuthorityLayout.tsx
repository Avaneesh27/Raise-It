import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  BarChart3,
  Bot,
  LogOut,
  Shield,
  Sun,
  Moon,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CivicAssistantModal } from '../components/CivicAssistantModal';
import { User } from '../types';

interface AuthorityLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export const AuthorityLayout: React.FC<AuthorityLayoutProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Workload Dashboard', path: '/authority', icon: LayoutDashboard },
    { label: 'Assigned Issues', path: '/authority/issues', icon: ClipboardList },
    { label: 'Priority Locations', path: '/authority/priority-locations', icon: MapPin },
    { label: 'Department Analytics', path: '/authority/analytics', icon: BarChart3 }
  ];

  const isActive = (path: string) => {
    if (path === '/authority' && location.pathname === '/authority') return true;
    if (path !== '/authority' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      {/* Authority Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0d1322] border-r border-slate-200 dark:border-slate-800 transition-colors">
        {/* Brand */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20">
              R
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                RaiseIt
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  AUTHORITY
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Department Resolution</p>
            </div>
          </Link>
        </div>

        {/* Department Badge Card */}
        <div className="p-3.5 mx-3 my-3 bg-slate-50 dark:bg-[#131b2e] rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.department?.name || 'Assigned Department'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Officer: {user?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Civic Assistant Trigger & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md transition"
          >
            <Bot className="w-4 h-4" />
            <span>Civic Assistant (SOPs)</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#0d1322] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 transition-colors">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">Department Jurisdiction:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                {user?.department?.name || 'Roads & Infrastructure'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 dark:text-purple-300 transition"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Municipal Assistant</span>
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* RAG Civic Assistant Global Modal */}
      <CivicAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />
    </div>
  );
};
