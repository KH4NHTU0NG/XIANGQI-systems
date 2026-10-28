import React, { useState } from 'react';
import { MoveCoachFeedback, MoveQuality } from '../engine/xiangqiEngine';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XOctagon,
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

const QUALITY_STYLES: Record<
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
    bg: 'bg-cyan-950/50',
    border: 'border-cyan-500/60',
    text: 'text-cyan-200',
    badgeBg: 'bg-cyan-500 text-stone-950',
    icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />,
  },
  Best: {
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-500/60',
    text: 'text-emerald-200',
    badgeBg: 'bg-emerald-500 text-stone-950',
    icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />,
  },
  Inaccuracy: {
    bg: 'bg-amber-950/50',
    border: 'border-amber-500/60',
    text: 'text-amber-200',
    badgeBg: 'bg-amber-500 text-stone-950',
    icon: <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />,
  },
  Blunder: {
    bg: 'bg-rose-950/60',
    border: 'border-rose-500/70',
    text: 'text-rose-200',
    badgeBg: 'bg-rose-600 text-white',
    icon: <XOctagon className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />,
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
      {/* Move Coach Evaluation Card */}
      {latestFeedback ? (
        <div
          className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
            QUALITY_STYLES[latestFeedback.quality].bg
          } ${QUALITY_STYLES[latestFeedback.quality].border}`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {QUALITY_STYLES[latestFeedback.quality].icon}
              <span
                className={`font-black text-sm sm:text-base ${
                  QUALITY_STYLES[latestFeedback.quality].text
                }`}
              >
                {latestFeedback.labelVi}
              </span>
              <span
                className={`text-xs font-black px-2 py-0.5 rounded ${
                  QUALITY_STYLES[latestFeedback.quality].badgeBg
                }`}
              >
                {latestFeedback.badge}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowWhy((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-950 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Tại sao?</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-200 mt-2 leading-relaxed">
            {latestFeedback.summary}
          </p>

          {showWhy && (
            <div className="mt-3 pt-3 border-t border-stone-700/60 space-y-2 text-xs sm:text-sm text-stone-300">
              <p className="leading-relaxed">{latestFeedback.whyExplanation}</p>
              {latestFeedback.recommendedMove && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-400">Nước chuẩn tối ưu:</span>
                  <code className="font-mono font-bold text-sm text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                    {latestFeedback.recommendedMove}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl px-4 py-3 bg-stone-950/70 border border-stone-800/80 text-xs sm:text-sm text-stone-400 flex items-center justify-between">
          <span>Đi một nước cờ trên bàn cờ để AI Huấn Luyện Viên chấm điểm (Move Coach).</span>
        </div>
      )}

      {/* Compact Move History Pills + Collapsible Theory Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-stone-400 font-semibold">Biên bản:</span>
          {moveHistory.length === 0 ? (
            <span className="text-stone-500 italic">Chưa có nước đi</span>
          ) : (
            moveHistory.map((m) => (
              <span
                key={m.ply}
                className={`px-2.5 py-1 rounded font-mono text-xs font-bold border ${
                  m.side === 'r'
                    ? 'bg-red-950/50 border-red-800/50 text-red-300'
                    : 'bg-stone-900 border-stone-700 text-stone-200'
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
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{showTheory ? 'Ẩn lý thuyết' : 'Xem lý thuyết'}</span>
          </button>
        )}
      </div>

      {showTheory && lessonTheory && (
        <div className="rounded-xl p-3.5 bg-stone-950/90 border border-stone-800 text-xs sm:text-sm text-stone-300 space-y-2 leading-relaxed">
          <p>{lessonTheory}</p>
          {lessonCitation && (
            <p className="text-xs text-stone-500 italic">{lessonCitation}</p>
          )}
        </div>
      )}
    </div>
  );
};
