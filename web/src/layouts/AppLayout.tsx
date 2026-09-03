import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  BarChart3,
  Bot,
  Users,
  Building2,
  Tags,
  BookOpen,
  LogOut,
  Shield,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { CivicAssistantModal } from '../components/CivicAssistantModal';
import { User } from '../types';

interface AppLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const authorityNavItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Assigned Issues', path: '/issues', icon: ClipboardList },
    { label: 'Priority Locations', path: '/priority-locations', icon: MapPin },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'All Issues', path: '/admin/issues', icon: ClipboardList },
    { label: 'Authorities', path: '/admin/authorities', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Issue Categories', path: '/admin/categories', icon: Tags },
    { label: 'Knowledge Base (RAG)', path: '/admin/knowledge-base', icon: BookOpen }
  ];

  const navItems = isAdmin ? adminNavItems : authorityNavItems;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              R
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                RaiseIt
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                  {isAdmin ? 'ADMIN' : 'OFFICER'}
                </span>
              </h1>
              <p className="text-xs text-slate-400">Civic Resolution Engine</p>
            </div>
          </div>
        </div>

        {/* User Identity / Department Tag */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.department?.name || (isAdmin ? 'System SuperAdmin' : 'Authority')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Civic Assistant Launch */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition"
          >
            <Bot className="w-4 h-4" />
            <span>Civic Assistant (RAG)</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 py-2 px-4 rounded-xl text-xs font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-xs text-slate-400">Jurisdiction:</span>
              <span className="text-xs font-semibold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {user?.department?.name || (isAdmin ? 'All Municipal Zones' : 'City Ward Jurisdiction')}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 transition"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask Assistant</span>
            </button>

            <div className="w-px h-6 bg-slate-800" />

            <div className="text-right">
              <p className="text-xs font-medium text-slate-200">{user?.name}</p>
              <p className="text-[10px] text-slate-400">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
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
