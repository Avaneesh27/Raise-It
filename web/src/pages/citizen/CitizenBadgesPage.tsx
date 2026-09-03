import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Star,
  Target,
  CheckCircle2,
  Award,
  Lock,
  Sparkles,
  Shield,
  TrendingUp,
  Flame,
  ArrowRight,
  Plus
} from 'lucide-react';
import { citizenApi } from '../../services/api';

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: (reportsCount: number, resolvedCount: number, categoriesCount: number, points: number) => boolean;
  getProgressText: (reportsCount: number, resolvedCount: number, categoriesCount: number, points: number) => string;
}

const BADGES: BadgeDefinition[] = [
  {
    id: 'first_reporter',
    name: 'First Reporter',
    description: 'Submit your first community issue report',
    tag: 'Reporter',
    icon: Target,
    isUnlocked: (reports) => reports >= 1,
    getProgressText: (reports) => (reports >= 1 ? 'Unlocked' : `${reports}/1 report`),
  },
  {
    id: 'active_reporter',
    name: 'Active Reporter',
    description: 'Submit 5 community issue reports',
    tag: 'Reporter',
    icon: Award,
    isUnlocked: (reports) => reports >= 5,
    getProgressText: (reports) => (reports >= 5 ? 'Unlocked' : `${reports}/5 reports`),
  },
  {
    id: 'super_reporter',
    name: 'Super Reporter',
    description: 'Submit 20 community issue reports',
    tag: 'Reporter',
    icon: Trophy,
    isUnlocked: (reports) => reports >= 20,
    getProgressText: (reports) => (reports >= 20 ? 'Unlocked' : `${reports}/20 reports`),
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    description: 'Have your first reported issue resolved by authorities',
    tag: 'Resolver',
    icon: CheckCircle2,
    isUnlocked: (_, resolved) => resolved >= 1,
    getProgressText: (_, resolved) => (resolved >= 1 ? 'Unlocked' : `${resolved}/1 resolved`),
  },
  {
    id: 'impact_maker',
    name: 'Impact Maker',
    description: 'Submit reports across 3 different civic categories',
    tag: 'Explorer',
    icon: TrendingUp,
    isUnlocked: (_, __, cats) => cats >= 3,
    getProgressText: (_, __, cats) => (cats >= 3 ? 'Unlocked' : `${cats}/3 categories`),
  },
  {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'Reach 5 verified resolved community issues',
    tag: 'Champion',
    icon: Shield,
    isUnlocked: (_, resolved) => resolved >= 5,
    getProgressText: (_, resolved) => (resolved >= 5 ? 'Unlocked' : `${resolved}/5 resolved`),
  },
  {
    id: 'eagle_eye',
    name: 'Eagle Eye',
    description: 'Submit a report with verified high-accuracy GPS & photo',
    tag: 'Explorer',
    icon: Star,
    isUnlocked: (reports) => reports >= 1,
    getProgressText: (reports) => (reports >= 1 ? 'Unlocked' : '0/1 verified'),
  },
  {
    id: 'civic_guardian',
    name: 'Civic Guardian',
    description: 'Earn 100+ civic contribution points',
    tag: 'Guardian',
    icon: Flame,
    isUnlocked: (_, __, ___, pts) => pts >= 100,
    getProgressText: (_, __, ___, pts) => (pts >= 100 ? 'Unlocked' : `${pts}/100 points`),
  },
];

export const CitizenBadgesPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    citizenApi
      .getMyReports()
      .then((res) => setReports(res.data?.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute Gamification Metrics
  const reportsSubmitted = reports.length;
  const issuesResolved = reports.filter((r) => r.status === 'RESOLVED').length;

  const uniqueCategories = new Set(
    reports.map((r) => r.categoryName || r.category || 'general')
  ).size;

  // Base points: 25 pts per report + 50 pts per resolved issue + bonus from localStorage
  const storedBonus = parseInt(localStorage.getItem('raiseit_points') || '0', 10);
  const totalPoints = Math.max(
    storedBonus,
    reportsSubmitted * 25 + issuesResolved * 50
  );

  // Level Progression: Level 1 (0-99), Level 2 (100-249), Level 3 (250-499), Level 4 (500+)
  let currentLevel = 1;
  let nextLevelPoints = 100;
  let prevLevelPoints = 0;

  if (totalPoints >= 500) {
    currentLevel = 4;
    nextLevelPoints = 1000;
    prevLevelPoints = 500;
  } else if (totalPoints >= 250) {
    currentLevel = 3;
    nextLevelPoints = 500;
    prevLevelPoints = 250;
  } else if (totalPoints >= 100) {
    currentLevel = 2;
    nextLevelPoints = 250;
    prevLevelPoints = 100;
  }

  const pointsInCurrentLevel = totalPoints - prevLevelPoints;
  const levelBracket = nextLevelPoints - prevLevelPoints;
  const progressPercent = Math.min(100, Math.round((pointsInCurrentLevel / levelBracket) * 100));
  const pointsRemaining = Math.max(0, nextLevelPoints - totalPoints);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Achievements
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Earn badges and recognition for making your community better.
        </p>
      </div>

      {/* 2. Metric Cards (Matching Image 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Level */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Level
            </span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
              {currentLevel}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Total Points */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Total Points
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {totalPoints}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

        {/* Reports Submitted */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Reports Submitted
            </span>
            <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mt-1 block">
              {reportsSubmitted}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Issues Resolved */}
        <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Issues Resolved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 mt-1 block">
              {issuesResolved}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Progress to Next Level (Matching Image 3) */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Progress to Level {currentLevel + 1}
          </span>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {totalPoints} / {nextLevelPoints} points
          </span>
        </div>

        {/* Level Track */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Earn {pointsRemaining} more points to reach the next level!
        </p>
      </div>

      {/* 4. Available Badges Catalog (Matching Image 3) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Available Badges ({BADGES.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGES.map((badge) => {
            const unlocked = badge.isUnlocked(
              reportsSubmitted,
              issuesResolved,
              uniqueCategories,
              totalPoints
            );
            const progress = badge.getProgressText(
              reportsSubmitted,
              issuesResolved,
              uniqueCategories,
              totalPoints
            );
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  unlocked
                    ? 'bg-white dark:bg-[#131b2e] border-emerald-500/40 shadow-md shadow-emerald-500/5 hover:-translate-y-0.5'
                    : 'bg-white/70 dark:bg-[#131b2e]/60 border-slate-200 dark:border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Badge Icon Circle */}
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform ${
                      unlocked
                        ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-400'
                    }`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={`text-base font-bold ${
                        unlocked
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Badge Tag and Status Pill */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {badge.tag}
                  </span>

                  <span
                    className={`font-mono text-[11px] font-bold flex items-center gap-1 ${
                      unlocked
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Unlocked</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{progress}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Motivation Strip */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Earn More XP</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            Report verified issues in your neighborhood to level up
          </h3>
          <p className="text-xs text-emerald-100">
            Every submission earns +25 XP. Every verified municipal resolution earns +50 XP.
          </p>
        </div>

        <Link
          to="/citizen/report"
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-emerald-800 font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Report an Issue</span>
        </Link>
      </div>
    </div>
  );
};
