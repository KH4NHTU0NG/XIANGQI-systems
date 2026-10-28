import React from 'react';
import { Trophy, Flame, Sparkles, GraduationCap } from 'lucide-react';

export interface RankTier {
  title: string;
  minExp: number;
  maxExp: number;
  badgeColor: string;
  desc: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    title: 'Tập Sự',
    minExp: 0,
    maxExp: 200,
    badgeColor: 'bg-stone-800 text-stone-200 border-stone-600',
    desc: 'Nắm vững luật đi quân & ký hiệu tọa độ.',
  },
  {
    title: 'Kỳ Thủ',
    minExp: 200,
    maxExp: 500,
    badgeColor: 'bg-emerald-900/80 text-emerald-200 border-emerald-500/50',
    desc: 'Thành thạo 10 Sát Pháp cơ bản.',
  },
  {
    title: 'Kiện Tướng',
    minExp: 500,
    maxExp: 900,
    badgeColor: 'bg-sky-900/80 text-sky-200 border-sky-500/50',
    desc: 'Làm chủ Khai cuộc & Cờ Tàn thực dụng.',
  },
  {
    title: 'Quốc Thủ',
    minExp: 900,
    maxExp: 1400,
    badgeColor: 'bg-purple-900/80 text-purple-200 border-purple-500/50',
    desc: 'Phế quân tranh tiên, giải cờ thế sâu.',
  },
  {
    title: 'Đại Sư',
    minExp: 1400,
    maxExp: 3000,
    badgeColor: 'bg-amber-900/80 text-amber-200 border-amber-400/60',
    desc: 'Tinh thông Khai - Trung - Tàn cuộc.',
  },
];

export function getRankForExp(exp: number): {
  current: RankTier;
  next: RankTier | null;
  progressPct: number;
} {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (exp >= RANK_TIERS[i].minExp) {
      const current = RANK_TIERS[i];
      const next = RANK_TIERS[i + 1] || null;
      const span = current.maxExp - current.minExp;
      const progressPct = next
        ? Math.min(100, Math.round(((exp - current.minExp) / span) * 100))
        : 100;
      return { current, next, progressPct };
    }
  }
  return { current: RANK_TIERS[0], next: RANK_TIERS[1], progressPct: 0 };
}

interface GamificationBarProps {
  exp: number;
  streakDays: number;
  completedIds: string[];
  totalLessons: number;
  dailyChallengeCompleted: boolean;
  onStartDailyChallenge: () => void;
  onOpenGrandmasterCoach: () => void;
}

export const GamificationBar: React.FC<GamificationBarProps> = ({
  exp,
  streakDays,
  completedIds,
  totalLessons,
  dailyChallengeCompleted,
  onStartDailyChallenge,
  onOpenGrandmasterCoach,
}) => {
  const { current, progressPct } = getRankForExp(exp);

  return (
    <header className="w-full bg-stone-900/90 border-b border-stone-800/80 px-4 py-2.5 sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Minimal Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-700 flex items-center justify-center font-serif font-bold text-lg text-amber-100 shadow-sm">
            帥
          </div>
          <span className="font-bold text-sm sm:text-base text-stone-100 tracking-tight">
            Xiangqi Mastery
          </span>
        </div>

        {/* Clean Compact Status Pills */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Rank + EXP Pill */}
          <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-full px-3 py-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-stone-200">{current.title}</span>
            <span className="text-stone-600">•</span>
            <span className="text-amber-400 font-semibold">{exp} EXP</span>
            <div className="hidden sm:block w-14 h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Streak & Progress Pill */}
          <div className="hidden md:flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-full px-3 py-1 text-stone-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold">{streakDays} ngày</span>
            <span className="text-stone-700">|</span>
            <span className="text-emerald-400 font-semibold">
              {completedIds.length}/{totalLessons} bài
            </span>
          </div>

          {/* Daily Challenge Compact Button */}
          <button
            type="button"
            onClick={onStartDailyChallenge}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition cursor-pointer ${
              dailyChallengeCompleted
                ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {dailyChallengeCompleted ? 'Đã xong hôm nay' : 'Thử thách ngày'}
            </span>
          </button>

          {/* 1-on-1 Coach Compact Button */}
          <button
            type="button"
            onClick={onOpenGrandmasterCoach}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 transition cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>HLV 1-1</span>
          </button>
        </div>
      </div>
    </header>
  );
};
