import React, { useState } from 'react';
import { MoveCoachFeedback, MoveQuality, BoardMatrix, Coord } from '../engine/xiangqiEngine';
import {
  Feather,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface MoveRecord {
  ply: number;
  side: 'r' | 'b';
  notation: string;
  quality?: MoveQuality;
  feedback?: MoveCoachFeedback;
  boardSnapshot?: BoardMatrix;
  from?: Coord;
  to?: Coord;
}

interface MoveCoachPanelProps {
  latestFeedback: MoveCoachFeedback | null;
  moveHistory: MoveRecord[];
  activePlyIndex: number | null; // null = live board
  onSelectPly: (plyIndex: number | null) => void;
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
  activePlyIndex,
  onSelectPly,
  lessonTheory,
  lessonCitation,
}) => {
  const [showWhy, setShowWhy] = useState<boolean>(false);
  const [showTheory, setShowTheory] = useState<boolean>(false);

  const currentViewingIndex = activePlyIndex !== null ? activePlyIndex : moveHistory.length - 1;

  const handlePrevPly = () => {
    if (moveHistory.length === 0) return;
    if (activePlyIndex === null) {
      if (moveHistory.length > 1) onSelectPly(moveHistory.length - 2);
    } else if (activePlyIndex > 0) {
      onSelectPly(activePlyIndex - 1);
    }
  };

  const handleNextPly = () => {
    if (moveHistory.length === 0 || activePlyIndex === null) return;
    if (activePlyIndex < moveHistory.length - 1) {
      onSelectPly(activePlyIndex + 1);
    } else {
      onSelectPly(null); // return to live
    }
  };

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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#291f18] hover:bg-[#382b21] text-[#f0caa0] border border-[#594432] text-xs sm:text-sm font-serif font-bold transition cursor-pointer shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-[#dfb673]" />
              <span>Bình chú ý đồ</span>
            </button>
          </div>

          <p className="text-sm text-[#f5eee6] mt-2.5 leading-relaxed font-serif">
            {latestFeedback.summary}
          </p>

          {showWhy && (
            <div className="mt-3 pt-3 border-t border-[#443528]/90 space-y-2 text-xs sm:text-sm text-[#e8ded2]">
              <p className="leading-relaxed font-serif">{latestFeedback.whyExplanation}</p>
              {latestFeedback.recommendedMove && (
                <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                  <span className="text-[#c7baa8] font-serif">Nước cờ chuẩn tối ưu:</span>
                  <code className="font-mono font-black text-[#86efac] bg-[#1a2d1d] px-3 py-1 rounded-lg border border-[#2f5c35] text-sm">
                    {latestFeedback.recommendedMove}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3.5 bg-[#1d1713] border border-[#3d2f23] text-sm text-[#cbbdaf] flex items-center justify-between font-serif">
          <span>Hãy xuất quân trên sa bàn để nhận lời bình chú nước đi.</span>
        </div>
      )}

      {/* Replay Controls & Notation History */}
      <div className="p-3.5 bg-[#16120f] border border-[#3d2e23] rounded-xl space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={moveHistory.length === 0 || activePlyIndex === 0}
              onClick={() => onSelectPly(0)}
              className="p-1.5 rounded-lg bg-[#241c16] hover:bg-[#332720] border border-[#3d2f23] text-[#e0d6c8] disabled:opacity-30 cursor-pointer"
              title="Về đầu ván"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={moveHistory.length === 0 || activePlyIndex === 0}
              onClick={handlePrevPly}
              className="p-1.5 rounded-lg bg-[#241c16] hover:bg-[#332720] border border-[#3d2f23] text-[#e0d6c8] disabled:opacity-30 cursor-pointer"
              title="Nước trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={moveHistory.length === 0 || activePlyIndex === null}
              onClick={handleNextPly}
              className="p-1.5 rounded-lg bg-[#241c16] hover:bg-[#332720] border border-[#3d2f23] text-[#e0d6c8] disabled:opacity-30 cursor-pointer"
              title="Nước sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={moveHistory.length === 0 || activePlyIndex === null}
              onClick={() => onSelectPly(null)}
              className="p-1.5 rounded-lg bg-[#241c16] hover:bg-[#332720] border border-[#3d2f23] text-[#dfb673] disabled:opacity-30 cursor-pointer text-xs font-bold px-2"
              title="Về hiện tại"
            >
              <ChevronsRight className="w-4 h-4 inline" />
            </button>
          </div>

          <div className="text-xs font-mono font-medium text-[#cbbdaf]">
            {activePlyIndex !== null ? (
              <span className="text-[#fae5a8] font-bold">Đang xem: Nước {activePlyIndex + 1}/{moveHistory.length}</span>
            ) : (
              <span>Thực chiến ({moveHistory.length} nước)</span>
            )}
          </div>
        </div>

        {/* Move History Pills */}
        <div className="flex flex-wrap items-center gap-1.5 max-h-[85px] overflow-y-auto">
          {moveHistory.length === 0 ? (
            <span className="text-[#8f7d6a] italic font-serif text-xs">Chưa có nước đi</span>
          ) : (
            moveHistory.map((m, idx) => {
              const isViewing = currentViewingIndex === idx;
              return (
                <button
                  key={m.ply}
                  type="button"
                  onClick={() => onSelectPly(idx)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold border cursor-pointer transition ${
                    isViewing
                      ? 'ring-2 ring-[#dfb673] bg-[#4a341f] text-[#fae5a8] border-[#dfb673]'
                      : m.side === 'r'
                      ? 'bg-[#3b1715] border-[#782823] text-[#fca5a5]'
                      : 'bg-[#241d18] border-[#4a3a2c] text-[#f0e6d6]'
                  }`}
                >
                  {m.notation}
                </button>
              );
            })
          )}
        </div>
      </div>

      {lessonTheory && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => setShowTheory((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-[#e2b972] hover:text-[#fae5a8] font-serif font-bold cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{showTheory ? 'Đóng kỳ lý' : 'Xem kỳ lý'}</span>
          </button>
        </div>
      )}

      {showTheory && lessonTheory && (
        <div className="rounded-xl p-4 bg-[#1a1512] border border-[#3d2f23] text-sm text-[#e6ded2] space-y-2 leading-relaxed font-serif shadow-inner">
          <p className="leading-relaxed">{lessonTheory}</p>
          {lessonCitation && (
            <p className="text-xs text-[#a89886] italic font-mono pt-1.5 border-t border-[#33261b]">
              {lessonCitation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
