import React, { useState } from 'react';
import { MoveCoachFeedback, MoveQuality } from '../engine/xiangqiEngine';
import {
  Feather,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface MoveRecord {
  ply: number;
  side: 'r' | 'b';
  notation: string;
  quality?: MoveQuality;
  feedback?: MoveCoachFeedback;
}

interface MoveCoachPanelProps {
  latestFeedback: MoveCoachFeedback | null;
  moveHistory: MoveRecord[];
  lessonTheory?: string;
  lessonCitation?: string;
}

const QUALITY_THEMES: Record<
  MoveQuality,
  {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    icon: React.ReactNode;
  }
> = {
  Brilliant: {
    bg: 'bg-[#1b262c]/90',
    border: 'border-[#2d4d5e]',
    text: 'text-[#93c5fd]',
    badgeBg: 'bg-[#1e3a5f] text-[#bfdbfe] border border-[#3b82f6]/40',
    icon: <Feather className="w-4 h-4 text-[#60a5fa] shrink-0" />,
  },
  Best: {
    bg: 'bg-[#1a261c]/90',
    border: 'border-[#2d5232]',
    text: 'text-[#86efac]',
    badgeBg: 'bg-[#1c4522] text-[#bbf7d0] border border-[#22c55e]/40',
    icon: <CheckCircle className="w-4 h-4 text-[#4ade80] shrink-0" />,
  },
  Inaccuracy: {
    bg: 'bg-[#292215]/90',
    border: 'border-[#594421]',
    text: 'text-[#fde047]',
    badgeBg: 'bg-[#473615] text-[#fef08a] border border-[#eab308]/40',
    icon: <AlertCircle className="w-4 h-4 text-[#facc15] shrink-0" />,
  },
  Blunder: {
    bg: 'bg-[#2b1716]/90',
    border: 'border-[#612826]',
    text: 'text-[#fca5a5]',
    badgeBg: 'bg-[#521b19] text-[#fecaca] border border-[#ef4444]/40',
    icon: <AlertCircle className="w-4 h-4 text-[#f87171] shrink-0" />,
  },
};

export const MoveCoachPanel: React.FC<MoveCoachPanelProps> = ({
  latestFeedback,
  moveHistory,
  lessonTheory,
  lessonCitation,
}) => {
  const [showWhy, setShowWhy] = useState<boolean>(false);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  return (
    <div className="space-y-3.5">
      {/* Move Evaluation Commentary Card */}
      {latestFeedback ? (
        <div
          className={`rounded-xl p-3.5 sm:p-4 border transition-all shadow-sm ${
            QUALITY_THEMES[latestFeedback.quality].bg
          } ${QUALITY_THEMES[latestFeedback.quality].border}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {QUALITY_THEMES[latestFeedback.quality].icon}
              <span
                className={`font-serif font-bold text-sm sm:text-base ${
                  QUALITY_THEMES[latestFeedback.quality].text
                }`}
              >
                {latestFeedback.labelVi}
              </span>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                  QUALITY_THEMES[latestFeedback.quality].badgeBg
                }`}
              >
                {latestFeedback.badge}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowWhy((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#33271f] text-[#dfb673] border border-[#4d3a2a] text-xs font-serif font-medium transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#dfb673]" />
              <span>Bình chú ý đồ</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#e0d6c8] mt-2 leading-relaxed">
            {latestFeedback.summary}
          </p>

          {showWhy && (
            <div className="mt-3 pt-3 border-t border-[#443528]/80 space-y-2 text-xs sm:text-sm text-[#c7baa8]">
              <p className="leading-relaxed italic">{latestFeedback.whyExplanation}</p>
              {latestFeedback.recommendedMove && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#968674]">Nước cờ chuẩn tối ưu:</span>
                  <code className="font-mono font-bold text-[#86efac] bg-[#1a2d1d] px-2.5 py-1 rounded border border-[#2f5c35]">
                    {latestFeedback.recommendedMove}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3 bg-[#1d1713] border border-[#382b20] text-xs sm:text-sm text-[#a89987] flex items-center justify-between font-serif">
          <span>Hãy xuất quân trên sa bàn để nhận lời bình chú nước đi.</span>
        </div>
      )}

      {/* Classical Move History Notation Line */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-[#8c7a68] font-serif font-semibold">Biên bản:</span>
          {moveHistory.length === 0 ? (
            <span className="text-[#635546] italic font-serif">Chưa khởi động</span>
          ) : (
            moveHistory.map((m) => (
              <span
                key={m.ply}
                className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                  m.side === 'r'
                    ? 'bg-[#3b1715] border-[#6b2521] text-[#fca5a5]'
                    : 'bg-[#221c17] border-[#423528] text-[#e0d6c8]'
                }`}
              >
                {m.notation}
              </span>
            ))
          )}
        </div>

        {lessonTheory && (
          <button
            type="button"
            onClick={() => setShowTheory((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-[#dfb673] hover:text-[#fae5a8] font-serif font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showTheory ? 'Đóng kỳ lý' : 'Xem kỳ lý'}</span>
          </button>
        )}
      </div>

      {showTheory && lessonTheory && (
        <div className="rounded-xl p-4 bg-[#1a1512] border border-[#3b2e23] text-xs sm:text-sm text-[#cfc2b0] space-y-2 leading-relaxed font-serif shadow-inner">
          <p className="leading-relaxed">{lessonTheory}</p>
          {lessonCitation && (
            <p className="text-[11px] text-[#806f5e] italic font-mono pt-1 border-t border-[#2e2319]">
              {lessonCitation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
