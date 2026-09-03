import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 dark:bg-[#070b12] border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                R
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                RAISE<span className="text-emerald-600 dark:text-emerald-400">IT</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.footer.tagline} Empowering citizens and municipal authorities with AI-assisted defect verification, geospatial recurring hotspot alerts, and grounded civic assistance.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg w-fit border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Municipal Standard Architecture</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {t.footer.product}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.howItWorks}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.features}
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.reportIssue}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.trackReports}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {t.footer.resources}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#assistant" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.civicAssistant}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.help}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              {t.footer.company} &amp; {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.about}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.contact}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.privacy}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {t.footer.links.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-500">
            {t.footer.copyright}
          </p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built for smarter municipal communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
