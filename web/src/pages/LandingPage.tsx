import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  FileText,
  AlertTriangle,
  Building2,
  Users,
  Compass,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu
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

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getReportDestination = () => {
    if (!user) return '/signup';
    if (user.role === 'CITIZEN') return '/citizen';
    if (user.role === 'AUTHORITY') return '/authority';
    return '/admin';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* 1. Global Navbar */}
      <LandingNavbar user={user} onLogout={onLogout} />

      {/* 2. Cinematic Scroll-Driven Frame Animation Hero */}
      <ScrollAnimationHero user={user} />

      {/* 3. Original Hero Section */}
      <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.hero.badge}</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                  RAISEIT
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  {t.hero.title}
                </h1>
              </div>

              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {t.hero.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={getReportDestination()}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleScrollTo('how-it-works')}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-[#1c2744] border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.hero.ctaSecondary}</span>
                </button>
              </div>

              {/* Verified Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
                  <div className="text-xs text-slate-500 font-medium">{t.hero.statsResolved}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">&lt; 24h</div>
                  <div className="text-xs text-slate-500 font-medium">{t.hero.statsSpeed}</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">500m</div>
                  <div className="text-xs text-slate-500 font-medium">Cluster Radius</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Storytelling Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white dark:bg-[#131b2e] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 p-6 space-y-5">
                {/* Header of Simulated Card */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Sample Citizen Report</div>
                      <div className="text-[10px] text-slate-500">Ticket #RI-1024</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    HIGH PRIORITY
                  </span>
                </div>

                {/* Simulated Issue Preview */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group">
                  <img
                    src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
                    alt="Road pothole civic issue"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>21.1458° N, 79.0882° E • Civil Lines</span>
                  </div>
                </div>

                {/* Intelligent Detection Pill */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d1322] border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      AI Vision Classifier
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">94% Confidence</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-slate-500">Category Detected</span>
                    <span className="font-bold text-slate-900 dark:text-white">Pothole / Road Defect</span>
                  </div>
                </div>

                {/* Recurrence Hotspot Notice */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-300 block">
                      Recurring Cluster Detected
                    </span>
                    <span className="text-amber-800/80 dark:text-amber-400/80 text-[11px]">
                      2 previous complaints recorded within 500m radius. Deterministic priority score calculated: 78/100.
                    </span>
                  </div>
                </div>

                {/* Routing Destination */}
                <div className="flex items-center justify-between text-xs pt-1 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    Auto-routed to:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Roads &amp; Infrastructure Dept
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: How RaiseIt Works (01 to 06 Visual Steps) */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#0d1322] border-y border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Simple &amp; Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.howItWorks.title}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.howItWorks.steps.map((step, idx) => (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400/80 group-hover:scale-105 transition-transform">
                    {step.number}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    {idx === 0 && <Camera className="w-4 h-4" />}
                    {idx === 1 && <MapPin className="w-4 h-4" />}
                    {idx === 2 && <Cpu className="w-4 h-4" />}
                    {idx === 3 && <Layers className="w-4 h-4" />}
                    {idx === 4 && <CheckCircle className="w-4 h-4" />}
                    {idx === 5 && <Clock className="w-4 h-4" />}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: Key Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.features.title}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: AI */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.features.aiTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.aiDesc}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Potholes</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Garbage Dumps</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Streetlights</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Water Leaks</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">Open Drains</span>
              </div>
            </div>

            {/* Feature 2: Recurrence */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.features.recurrenceTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.recurrenceDesc}
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1322] p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60">
                Priority = Base(40) + AI Conf(20) + Recurrence(30) + Recency(10)
              </div>
            </div>

            {/* Feature 3: Tracking */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.features.trackingTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.trackingDesc}
              </p>
              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>SUBMITTED</span>
                <span>→</span>
                <span>UNDER REVIEW</span>
                <span>→</span>
                <span>ASSIGNED</span>
                <span>→</span>
                <span>IN PROGRESS</span>
                <span>→</span>
                <span className="text-emerald-600 dark:text-emerald-400">RESOLVED</span>
              </div>
            </div>

            {/* Feature 4: RAG Civic Assistant */}
            <div id="assistant" className="p-8 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.features.assistantTitle}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.features.assistantDesc}
              </p>
              <div className="pt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Zero hallucinations: strictly grounded on verified municipal charters.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Citizen -> Authority Workflow Story */}
      <section id="workflow" className="py-20 bg-white dark:bg-[#0d1322] border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              End-To-End Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.workflow.title}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {t.workflow.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t.workflow.citizenStep}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.workflow.citizenDesc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t.workflow.aiStep}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.workflow.aiDesc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t.workflow.authorityStep}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.workflow.authorityDesc}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                4
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {t.workflow.resolvedStep}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.workflow.resolvedDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Call To Action */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-[#090d16] dark:to-[#07131b]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.cta.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={getReportDestination()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.cta.button}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {t.cta.authorityLink}
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
