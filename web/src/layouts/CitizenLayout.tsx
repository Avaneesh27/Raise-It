import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  Bot,
  User,
  Plus,
  Sun,
  Moon,
  LogOut,
  MapPin,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User as UserType } from '../types';
import { ReportCreationModal } from '../components/citizen/ReportCreationModal';
import { CivicAssistantModal } from '../components/CivicAssistantModal';

interface CitizenLayoutProps {
  user: UserType | null;
  onLogout: () => void;
}

export const CitizenLayout: React.FC<CitizenLayoutProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [activeReportIdForAssistant, setActiveReportIdForAssistant] = useState<string | undefined>();

  const isActive = (path: string) => {
    if (path === '/citizen' && location.pathname === '/citizen') return true;
    if (path !== '/citizen' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleOpenAssistant = (reportId?: string) => {
    setActiveReportIdForAssistant(reportId);
    setAssistantModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Citizen Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Citizen Badge */}
          <div className="flex items-center gap-3">
            <Link to="/citizen" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
                R
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                RAISE<span className="text-emerald-600 dark:text-emerald-400">IT</span>
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Citizen Portal
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/citizen"
              className={`text-sm font-semibold transition-colors ${
                isActive('/citizen')
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/citizen/reports"
              className={`text-sm font-semibold transition-colors ${
                isActive('/citizen/reports')
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              My Reports
            </Link>

            <button
              onClick={() => handleOpenAssistant()}
              className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-purple-500" />
              <span>Civic Assistant</span>
            </button>

            <Link
              to="/citizen/profile"
              className={`text-sm font-semibold transition-colors ${
                isActive('/citizen/profile')
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Actions: Primary "+ Report a Problem" & Theme & Logout */}
          <div className="flex items-center gap-3">
            {/* Very Prominent Primary Action Button */}
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Report a Problem</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              title="Toggle Day/Night"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content Outlet */}
      <main className="flex-1 pb-20 md:pb-10">
        <Outlet
          context={{
            user,
            onOpenReportModal: () => setReportModalOpen(true),
            onOpenAssistant: handleOpenAssistant
          }}
        />
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-6 flex items-center justify-between">
        <Link
          to="/citizen"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            isActive('/citizen')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/citizen/reports"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            isActive('/citizen/reports')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span>Reports</span>
        </Link>

        {/* Center Floating Plus Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="-mt-5 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/40 flex items-center justify-center font-bold"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleOpenAssistant()}
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-purple-600"
        >
          <Bot className="w-5 h-5" />
          <span>Assistant</span>
        </button>

        <Link
          to="/citizen/profile"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            isActive('/citizen/profile')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Report Creation Modal */}
      <ReportCreationModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSuccess={(reportId) => {
          setReportModalOpen(false);
          navigate('/citizen/reports');
        }}
      />

      {/* Contextual RAG Civic Assistant Modal */}
      <CivicAssistantModal
        isOpen={assistantModalOpen}
        onClose={() => setAssistantModalOpen(false)}
        reportId={activeReportIdForAssistant}
      />
    </div>
  );
};
