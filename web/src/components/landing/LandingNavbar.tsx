import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Globe, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/translations';
import { User } from '../../types';

interface LandingNavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'CITIZEN') return '/citizen';
    if (user.role === 'AUTHORITY') return '/authority';
    if (user.role === 'ADMIN') return '/admin';
    return '/';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="w-full h-16 sm:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between pointer-events-auto transition-all duration-300">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white transition-transform">
            <span className="font-bold text-lg">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              RAISE<span className="text-emerald-600 dark:text-emerald-400">IT</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase -mt-0.5">
              Civic Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900/50">
          <a href="#operations" className="text-sm font-medium px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors">
            Live Operations
          </a>
          <a href="#how-it-works" className="text-sm font-medium px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors">
            {t.nav.howItWorks}
          </a>
          <a href="#about" className="text-sm font-medium px-4 py-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors">
            {t.nav.about}
          </a>
        </div>

        {/* Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language.toUpperCase()}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 shadow-lg z-50">
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
                      language === lang
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                    {language === lang && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardRoute()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-bold transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl pointer-events-auto pb-4">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="#operations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900">Live Operations</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900">{t.nav.howItWorks}</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900">{t.nav.about}</a>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button onClick={toggleTheme} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium text-sm">Theme</span>
            </button>
            <div className="flex gap-2">
              {(['en', 'hi', 'mr'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setMobileMenuOpen(false); }}
                  className={`px-3 py-1 rounded-md text-xs font-bold uppercase border ${
                    language === lang 
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pb-2 pt-2">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link to={getDashboardRoute()} onClick={() => setMobileMenuOpen(false)} className="w-full py-3 flex justify-center rounded-lg bg-emerald-600 text-white font-bold">Dashboard</Link>
                {onLogout && (
                  <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full py-3 flex justify-center rounded-lg border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">Logout</button>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 flex justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
