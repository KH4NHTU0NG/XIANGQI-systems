import React from 'react';
import { Award, Flame, ScrollText, UserCheck } from 'lucide-react';

export interface RankTier {
  title: string;
  minExp: number;
  maxExp: number;
  desc: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    title: 'Tập Sự',
    minExp: 0,
    maxExp: 200,
    desc: 'Nắm vững luật đi quân & ký hiệu tọa độ.',
  },
  {
    title: 'Kỳ Thủ',
    minExp: 200,
    maxExp: 500,
    desc: 'Thành thạo 10 Sát Pháp cơ bản.',
  },
  {
    title: 'Kiện Tướng',
    minExp: 500,
    maxExp: 900,
    desc: 'Làm chủ Khai cuộc & Cờ Tàn thực dụng.',
  },
  {
    title: 'Quốc Thủ',
    minExp: 900,
    maxExp: 1400,
    desc: 'Phế quân tranh tiên, giải cờ thế sâu.',
  },
  {
    title: 'Đại Sư',
    minExp: 1400,
    maxExp: 3000,
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
    <header className="w-full bg-[#181411]/95 border-b border-[#362a20] px-4 py-3 sticky top-0 z-30 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Traditional Seal & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#8c221e] border border-[#b83833] flex items-center justify-center font-serif font-black text-xl text-[#fcedc7] shadow-inner">
            帥
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg text-[#f0e6d6] tracking-wide leading-tight">
              TƯỢNG KỲ QUAN
            </span>
            <span className="text-[10px] text-[#9c8975] uppercase tracking-widest font-mono">
              Hệ Thống Luyện Tập & Kỳ Phổ
            </span>
          </div>
        </div>

        {/* Traditional Craft Status Display */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Rank + EXP Badge */}
          <div className="flex items-center gap-2 bg-[#201a15] border border-[#3d3227] rounded-lg px-3 py-1.5 shadow-sm">
            <Award className="w-4 h-4 text-[#dfb673]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif font-bold text-[#dfb673]">{current.title}</span>
                <span className="text-[#6d5b4b] text-[10px]">•</span>
                <span className="text-[#e2dad0] font-mono text-[11px]">{exp} EXP</span>
              </div>
              <div className="w-20 sm:w-24 h-1 rounded-full bg-[#33281f] overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#b3883b] to-[#dfb673] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Streak & Progress */}
          <div className="hidden md:flex items-center gap-2 bg-[#201a15] border border-[#3d3227] rounded-lg px-3 py-1.5 text-[#cfc5b8] shadow-sm">
            <Flame className="w-4 h-4 text-[#d97706]" />
            <span className="font-medium">{streakDays} ngày</span>
            <span className="text-[#4d3e31]">|</span>
            <span className="text-[#a3b899] font-medium">
              {completedIds.length}/{totalLessons} phổ
            </span>
          </div>

          {/* Daily Puzzle Button */}
          <button
            type="button"
            onClick={onStartDailyChallenge}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shadow-sm ${
              dailyChallengeCompleted
                ? 'bg-[#1e291e] border border-[#385238] text-[#86efac]'
                : 'bg-[#8c221e] hover:bg-[#a62b27] border border-[#b83833] text-[#fcedc7]'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {dailyChallengeCompleted ? 'Đã phá thế hôm nay' : 'Cờ thế nhật tụng'}
            </span>
          </button>

          {/* Grandmaster Coach Button */}
          <button
            type="button"
            onClick={onOpenGrandmasterCoach}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-[#2a221b] hover:bg-[#382d24] text-[#dfb673] border border-[#4a3b2e] transition cursor-pointer shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-[#dfb673]" />
            <span>Đại Sư Chỉ Điểm</span>
          </button>
        </div>
      </div>
    </header>
  );
};
