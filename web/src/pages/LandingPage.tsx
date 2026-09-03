import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  ExternalLink,
  Activity,
  FileCheck,
  Radio,
  Sparkles,
} from 'lucide-react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingFooter } from '../components/landing/LandingFooter';
import { ScrollAnimationHero } from '../components/landing/ScrollAnimationHero';
import { useLanguage } from '../context/LanguageContext';
import { User } from '../types';

interface LandingPageProps {
  user: User | null;
  onLogout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ user, onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'roads' | 'water' | 'sanitation'>('all');

  const getReportDestination = () => {
    if (!user) return '/signup';
    if (user.role === 'CITIZEN') return '/citizen';
    if (user.role === 'AUTHORITY') return '/authority';
    return '/admin';
  };

  const sampleDispatches = [
    {
      id: 'RI-8924',
      ward: 'Ward 04 • Civil Lines',
      category: 'Deep Asphalt Fissure / Pothole',
      dept: 'Public Works Department',
      status: 'DISPATCHED',
      slaRemaining: '11h 45m',
      coordinates: '21.1458° N, 79.0882° E',
      confidence: '96.2%',
      recurrence: '3 reports clustered (500m)',
      type: 'roads',
    },
    {
      id: 'RI-8920',
      ward: 'Ward 11 • Dharampeth',
      category: 'Municipal Water Main Breach',
      dept: 'Water Supply & Sewerage Board',
      status: 'CREW EN ROUTE',
      slaRemaining: '04h 10m',
      coordinates: '21.1394° N, 79.0621° E',
      confidence: '98.5%',
      recurrence: 'High Priority Hotspot',
      type: 'water',
    },
    {
      id: 'RI-8914',
      ward: 'Ward 07 • Sitabuldi Market',
      category: 'Overflowing Commercial Dumpster',
      dept: 'Solid Waste Management',
      status: 'RESOLVED',
      slaRemaining: 'Completed in 14h',
      coordinates: '21.1480° N, 79.0825° E',
      confidence: '94.8%',
      recurrence: 'Scheduled Cleared',
      type: 'sanitation',
    },
  ];

  const filteredDispatches =
    activeTab === 'all'
      ? sampleDispatches
      : sampleDispatches.filter((d) => d.type === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      {/* 1. Global Navbar */}
      <LandingNavbar user={user} onLogout={onLogout} />

      {/* 2. Cinematic 149-Frame Scroll Hero */}
      <ScrollAnimationHero user={user} />

      {/* 3. Live Municipal Telemetry */}
      <section id="operations" className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Live Incident Stream
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                View recently reported civic issues in your area. Submissions are automatically verified and routed to the correct department.
              </p>
            </div>

            <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
              {(['all', 'roads', 'water', 'sanitation'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDispatches.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{item.id}</span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : item.status === 'CREW EN ROUTE'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {item.category}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Building2 className="w-4 h-4" />
                    <span>{item.dept}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Location</span>
                      <span className="font-medium text-slate-900 dark:text-slate-200">{item.ward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className="font-medium text-slate-900 dark:text-slate-200">{item.confidence}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>SLA: {item.slaRemaining}</span>
                  </div>
                  <Link
                    to={getReportDestination()}
                    className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Report a civic issue in your area</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Help us improve the city by reporting problems.</p>
            </div>
            <Link
              to={getReportDestination()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Submit Report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Section: How It Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How RaiseIt Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              A simple, transparent process from reporting a problem to its final resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '1. Report an Issue',
                desc: 'Take a photo of the problem. Our system automatically captures the GPS location and categorizes the issue.',
                icon: Camera,
              },
              {
                title: '2. Automated Routing',
                desc: 'The issue is intelligently assigned to the correct municipal department with a clear deadline for resolution.',
                icon: Layers,
              },
              {
                title: '3. Track Progress',
                desc: 'Follow the status of your report in real-time until a field engineer marks it as resolved.',
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section: Direct Public Call to Action */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ready to improve your city?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Join citizens and municipal workers on a single, transparent accountability platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={getReportDestination()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Authority Login
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <div id="about">
        <LandingFooter />
      </div>
    </div>
  );
};
