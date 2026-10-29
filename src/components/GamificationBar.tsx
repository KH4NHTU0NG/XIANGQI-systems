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
          <div className="w-10 h-10 rounded-lg bg-[#8c221e] border border-[#b83833] flex items-center justify-center font-serif font-black text-2xl text-[#fcedc7] shadow-inner">
            帥
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-base sm:text-lg text-[#faf3ea] tracking-wider leading-tight">
              TƯỢNG KỲ QUAN
            </span>
            <span className="text-xs text-[#c2b29f] uppercase tracking-wider font-mono font-medium">
              Hệ Thống Luyện Tập & Kỳ Phổ
            </span>
          </div>
        </div>

        {/* Traditional Craft Status Display */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Rank + EXP Badge */}
          <div className="flex items-center gap-2.5 bg-[#201a15] border border-[#443528] rounded-xl px-3.5 py-1.5 shadow-sm">
            <Award className="w-4 h-4 text-[#dfb673]" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif font-bold text-[#f6d28b] text-sm">{current.title}</span>
                <span className="text-[#806d5c] text-xs">•</span>
                <span className="text-[#f5ede4] font-mono font-bold text-xs">{exp} EXP</span>
              </div>
              <div className="w-20 sm:w-24 h-1.5 rounded-full bg-[#33281f] overflow-hidden mt-1.5">
                <div
                  className="h-full bg-gradient-to-r from-[#b3883b] to-[#dfb673] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily Streak & Progress */}
          <div className="hidden md:flex items-center gap-2 bg-[#201a15] border border-[#443528] rounded-xl px-3.5 py-2 text-[#e6ded2] shadow-sm font-serif">
            <Flame className="w-4 h-4 text-[#ea580c]" />
            <span className="font-bold text-xs sm:text-sm">{streakDays} ngày</span>
            <span className="text-[#594738]">|</span>
            <span className="text-[#86efac] font-bold text-xs sm:text-sm">
              {completedIds.length}/{totalLessons} phổ
            </span>
          </div>

          {/* Daily Puzzle Button */}
          <button
            type="button"
            onClick={onStartDailyChallenge}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-serif font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm ${
              dailyChallengeCompleted
                ? 'bg-[#1b2b1d] border border-[#3b5e3b] text-[#86efac]'
                : 'bg-[#8c221e] hover:bg-[#a62b27] border border-[#b83833] text-[#fcedc7]'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span className="hidden sm:inline">
              {dailyChallengeCompleted ? 'Đã phá thế hôm nay' : 'Cờ thế nhật tụng'}
            </span>
          </button>

          {/* Grandmaster Coach Button */}
          <button
            type="button"
            onClick={onOpenGrandmasterCoach}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-serif font-bold text-xs sm:text-sm bg-[#2a221b] hover:bg-[#382d24] text-[#f6d28b] border border-[#524032] transition cursor-pointer shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-[#dfb673]" />
            <span>Đại Sư Chỉ Điểm</span>
          </button>
        </div>
      </div>
    </header>
  );
};
