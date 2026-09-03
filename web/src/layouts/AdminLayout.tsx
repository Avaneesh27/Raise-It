import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Tags,
  BookOpen,
  Bot,
  LogOut,
  ShieldAlert,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CivicAssistantModal } from '../components/CivicAssistantModal';
import { User } from '../types';

interface AdminLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'System Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'All City Complaints', path: '/admin/issues', icon: ClipboardList },
    { label: 'Authority Approvals', path: '/admin/authorities', icon: Users },
    { label: 'Municipal Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Categories & Priority Weights', path: '/admin/categories', icon: Tags },
    { label: 'Civic Knowledge Base (RAG)', path: '/admin/knowledge-base', icon: BookOpen }
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0d1322] border-r border-slate-200 dark:border-slate-800 transition-colors">
        {/* Brand */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-amber-500/20">
              R
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                RaiseIt
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  ADMIN
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">City SuperAdmin</p>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-3 my-3 bg-slate-50 dark:bg-[#131b2e] rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Full Municipal Access
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
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-bold'
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
            <span>Civic Assistant (RAG)</span>
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
              <span className="text-xs text-slate-500">System Jurisdiction:</span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                City-Wide Administration • All Departments
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">SuperAdmin</p>
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
