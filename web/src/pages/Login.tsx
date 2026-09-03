import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, AlertCircle, Sparkles, Building2, User, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { User as UserType } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserType, token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data;
      localStorage.setItem('raiseit_token', token);
      localStorage.setItem('raiseit_user', JSON.stringify(user));
      onLoginSuccess(user, token);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'AUTHORITY') {
        navigate('/authority');
      } else {
        navigate('/citizen');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors font-sans">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/40 relative overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-emerald-600/20 mb-3">
              R
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              RaiseIt Sign In
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Access Citizen, Authority, or Administrator portal
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center space-x-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-[#0d1322] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* Citizen Sign Up Link */}
          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Create Citizen Account
            </Link>
          </div>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Quick Demo Switcher (Click to auto-fill):</span>
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('citizen@example.com', 'Password@123')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition"
              >
                <div className="font-bold text-sky-600 dark:text-sky-400">Citizen Account</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Civic Reporter</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('roads.officer@raiseit.gov', 'Password@123')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition"
              >
                <div className="font-bold text-emerald-600 dark:text-emerald-400">Roads Officer</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Potholes &amp; Infra</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('sanitation.officer@raiseit.gov', 'Password@123')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition"
              >
                <div className="font-bold text-teal-600 dark:text-teal-400">Sanitation Officer</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Solid Waste Dept</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('admin@raiseit.gov', 'Password@123')}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition"
              >
                <div className="font-bold text-amber-600 dark:text-amber-400">Administrator</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">System SuperAdmin</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
