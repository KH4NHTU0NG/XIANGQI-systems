import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BoardMatrix,
  Coord,
  Move,
  BlockedInfo,
  MoveCoachFeedback,
  MoveQuality,
  PIECE_VALUES,
  INITIAL_FEN,
  parseFEN,
  getLegalMovesForSquare,
  makeMoveOnBoard,
  evaluateMoveCoach,
  findBestMove,
  isCheckmateOrNoMoves,
} from './engine/xiangqiEngine';
import {
  MASTERY_LESSONS,
  TIER_METADATA,
  MasteryLesson,
} from './data/masteryData';
import {
  XiangqiBoard,
  PieceLabelMode,
  ArrowGuide,
} from './components/XiangqiBoard';
import { MoveCoachPanel } from './components/MoveCoachPanel';
import { GamificationBar } from './components/GamificationBar';
import { GrandmasterCoachModal } from './components/GrandmasterCoachModal';
import {
  RotateCcw,
  Lightbulb,
  Timer,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Shield,
  Award,
  Eye,
  Bot,
  Layers,
  Target,
} from 'lucide-react';

interface MoveRecord {
  ply: number;
  side: 'r' | 'b';
  notation: string;
  quality?: MoveQuality;
  feedback?: MoveCoachFeedback;
}

export const App: React.FC = () => {
  // Persistent Gamification State
  const [exp, setExp] = useState<number>(() => {
    const saved = localStorage.getItem('xq_exp');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [streakDays] = useState<number>(() => {
    const saved = localStorage.getItem('xq_streak');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('xq_completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyDone, setDailyDone] = useState<boolean>(() => {
    return localStorage.getItem('xq_daily_done') === 'true';
  });

  // Active Navigation & Right Panel Tab ('train' | 'roadmap')
  const [rightTab, setRightTab] = useState<'train' | 'roadmap'>('train');
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | 4>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>('T1-01');
  const [isSparringBot, setIsSparringBot] = useState<boolean>(false);
  const [showPieceValueTable, setShowPieceValueTable] =
    useState<boolean>(false);
  const [isGrandmasterOpen, setIsGrandmasterOpen] = useState<boolean>(false);

  // Board & Gameplay State
  const currentLesson: MasteryLesson = useMemo(
    () =>
      MASTERY_LESSONS.find((l) => l.id === activeLessonId) ||
      MASTERY_LESSONS[0],
    [activeLessonId]
  );

  const currentLessonIndex = useMemo(
    () => MASTERY_LESSONS.findIndex((l) => l.id === currentLesson.id),
    [currentLesson]
  );

  const [board, setBoard] = useState<BoardMatrix>(
    () => parseFEN(currentLesson.initialFen).board
  );
  const [turn, setTurn] = useState<'r' | 'b'>('r');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedSquare, setSelectedSquare] = useState<Coord | null>(null);
  const [legalMoves, setLegalMoves] = useState<Move[]>([]);
  const [blockedInfos, setBlockedInfos] = useState<BlockedInfo[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Coord; to: Coord } | null>(
    null
  );
  const [latestFeedback, setLatestFeedback] =
    useState<MoveCoachFeedback | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);

  // Display & Hint Controls (Default clean Vietnamese symbol mode)
  const [labelMode, setLabelMode] = useState<PieceLabelMode>('vn');
  const [showThreatRadar, setShowThreatRadar] = useState<boolean>(false);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDailyChallengeMode, setIsDailyChallengeMode] =
    useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('xq_exp', String(exp));
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('xq_completed', JSON.stringify(completedIds));
  }, [completedIds]);

  const resetCurrentBoard = useCallback(
    (lesson: MasteryLesson, sparring: boolean) => {
      const fen = sparring ? INITIAL_FEN : lesson.initialFen;
      const parsed = parseFEN(fen);
      setBoard(parsed.board);
      setTurn(parsed.turn);
      setStepIndex(0);
      setSelectedSquare(null);
      setLegalMoves([]);
      setBlockedInfos([]);
      setLastMove(null);
      setLatestFeedback(null);
      setMoveHistory([]);
      setLessonCompleted(false);
      setHintLevel(0);
      setTimeLeft(
        !sparring && lesson.timeLimitSec ? lesson.timeLimitSec : null
      );
    },
    []
  );

  useEffect(() => {
    resetCurrentBoard(currentLesson, isSparringBot);
  }, [currentLesson, isSparringBot, resetCurrentBoard]);

  // Tier 4 Countdown Timer with clean cleanup
  useEffect(() => {
    if (
      timeLeft === null ||
      timeLeft <= 0 ||
      lessonCompleted ||
      isSparringBot
    ) {
      return;
    }
    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [timeLeft, lessonCompleted, isSparringBot]);

  const awardExp = useCallback((amount: number) => {
    setExp((prev) => prev + amount);
  }, []);

  const arrowGuides: ArrowGuide[] = useMemo(() => {
    if (isSparringBot || lessonCompleted) return [];
    const activeStep = currentLesson.steps[stepIndex];
    if (!activeStep) return [];

    if (currentLesson.tier === 3 || hintLevel === 3) {
      return [
        {
          from: activeStep.playerMove.from,
          to: activeStep.playerMove.to,
          color: currentLesson.tier === 3 ? '#059669' : '#2563eb',
          label: activeStep.playerMove.notation,
        },
      ];
    }
    return [];
  }, [currentLesson, stepIndex, hintLevel, isSparringBot, lessonCompleted]);

  const handleSquareClick = (r: number, c: number) => {
    if (lessonCompleted || turn !== 'r') return;
    if (timeLeft === 0 && !isSparringBot) return;

    const clickedPiece = board[r][c];

    if (selectedSquare) {
      const chosenMove = legalMoves.find(
        (m) => m.to.r === r && m.to.c === c
      );
      if (chosenMove) {
        executePlayerMove(chosenMove);
        return;
      }
    }

    if (clickedPiece && clickedPiece.side === 'r') {
      setSelectedSquare({ r, c });
      const { moves, blocks } = getLegalMovesForSquare(board, r, c);
      setLegalMoves(moves);
      setBlockedInfos(blocks);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
      setBlockedInfos([]);
    }
  };

  const executePlayerMove = (move: Move) => {
    setSelectedSquare(null);
    setLegalMoves([]);
    setBlockedInfos([]);

    if (isSparringBot) {
      const feedback = evaluateMoveCoach(board, move);
      const nextBoard = makeMoveOnBoard(board, move.from, move.to);
      setBoard(nextBoard);
      setLastMove({ from: move.from, to: move.to });
      setLatestFeedback(feedback);
      setMoveHistory((prev) => [
        ...prev,
        {
          ply: prev.length + 1,
          side: 'r',
          notation: move.vnNotation,
          quality: feedback.quality,
          feedback,
        },
      ]);

      if (isCheckmateOrNoMoves(nextBoard, 'b')) {
        setLessonCompleted(true);
        awardExp(100);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        return;
      }

      setTurn('b');
      window.setTimeout(() => {
        const { move: botMove } = findBestMove(nextBoard, 'b', 2);
        if (botMove) {
          const afterBot = makeMoveOnBoard(nextBoard, botMove.from, botMove.to);
          setBoard(afterBot);
          setLastMove({ from: botMove.from, to: botMove.to });
          setMoveHistory((prev) => [
            ...prev,
            {
              ply: prev.length + 1,
              side: 'b',
              notation: botMove.vnNotation,
            },
          ]);
          setTurn('r');
        }
      }, 350);
      return;
    }

    const expectedStep = currentLesson.steps[stepIndex];
    if (!expectedStep) return;

    const isExactMatch =
      move.from.r === expectedStep.playerMove.from.r &&
      move.from.c === expectedStep.playerMove.from.c &&
      move.to.r === expectedStep.playerMove.to.r &&
      move.to.c === expectedStep.playerMove.to.c;

    const feedback = evaluateMoveCoach(
      board,
      move,
      expectedStep.playerMove.notation,
      expectedStep.playerMove.whyBest
    );

    if (!isExactMatch) {
      const wrongFeedback: MoveCoachFeedback = {
        quality:
          feedback.quality === 'Blunder' ? 'Blunder' : 'Inaccuracy',
        labelVi:
          feedback.quality === 'Blunder'
            ? 'Nước Sai Lầm (Blunder)'
            : 'Chưa Chuẩn (Inaccuracy)',
        badge: feedback.quality === 'Blunder' ? '??' : '?!',
        scoreDelta: -1.8,
        summary: `Nước ${move.vnNotation} chưa đúng ý đồ chiến thuật của bài tập này.`,
        whyExplanation: `Nước đi tối ưu là ${expectedStep.playerMove.notation}: ${expectedStep.playerMove.whyBest}`,
        recommendedMove: expectedStep.playerMove.notation,
      };
      setLatestFeedback(wrongFeedback);
      return;
    }

    const nextBoard = makeMoveOnBoard(board, move.from, move.to);
    setBoard(nextBoard);
    setLastMove({ from: move.from, to: move.to });
    setLatestFeedback(feedback);
    setMoveHistory((prev) => [
      ...prev,
      {
        ply: prev.length + 1,
        side: 'r',
        notation: move.vnNotation,
        quality: feedback.quality,
        feedback,
      },
    ]);

    if (expectedStep.opponentReply) {
      setTurn('b');
      const reply = expectedStep.opponentReply;
      window.setTimeout(() => {
        const afterReply = makeMoveOnBoard(nextBoard, reply.from, reply.to);
        setBoard(afterReply);
        setLastMove({ from: reply.from, to: reply.to });
        setMoveHistory((prev) => [
          ...prev,
          {
            ply: prev.length + 1,
            side: 'b',
            notation: reply.notation,
          },
        ]);
        setTurn('r');
        setStepIndex((prev) => prev + 1);
      }, 380);
    } else if (stepIndex + 1 < currentLesson.steps.length) {
      setStepIndex((prev) => prev + 1);
    } else {
      setLessonCompleted(true);
      if (!completedIds.includes(currentLesson.id)) {
        setCompletedIds((prev) => [...prev, currentLesson.id]);
        awardExp(currentLesson.expReward);
      }
      if (isDailyChallengeMode && !dailyDone) {
        setDailyDone(true);
        localStorage.setItem('xq_daily_done', 'true');
        awardExp(80);
      }
      confetti({ particleCount: 65, spread: 65, origin: { y: 0.65 } });
    }
  };

  const handleStartDailyChallenge = () => {
    setIsSparringBot(false);
    setIsDailyChallengeMode(true);
    setActiveTier(4);
    setActiveLessonId('T4-01');
    setRightTab('train');
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prev = MASTERY_LESSONS[currentLessonIndex - 1];
      setIsSparringBot(false);
      setIsDailyChallengeMode(false);
      setActiveTier(prev.tier);
      setActiveLessonId(prev.id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex >= 0 && currentLessonIndex + 1 < MASTERY_LESSONS.length) {
      const next = MASTERY_LESSONS[currentLessonIndex + 1];
      setIsSparringBot(false);
      setIsDailyChallengeMode(false);
      setActiveTier(next.tier);
      setActiveLessonId(next.id);
    }
  };

  const lessonsInActiveTier = useMemo(
    () => MASTERY_LESSONS.filter((l) => l.tier === activeTier),
    [activeTier]
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Compact Header */}
      <GamificationBar
        exp={exp}
        streakDays={streakDays}
        completedIds={completedIds}
        totalLessons={MASTERY_LESSONS.length}
        dailyChallengeCompleted={dailyDone}
        onStartDailyChallenge={handleStartDailyChallenge}
        onOpenGrandmasterCoach={() => setIsGrandmasterOpen(true)}
      />

      {/* Focused 2-Column Layout (Board Left, Unified Coach/Lesson Panel Right) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols): Clean, Spacious Chessboard + Subtle Footer Controls */}
        <section className="lg:col-span-7 flex flex-col items-center gap-3">
          <XiangqiBoard
            board={board}
            turn={turn}
            selectedSquare={selectedSquare}
            legalMoves={legalMoves}
            blockedInfos={blockedInfos}
            lastMove={lastMove}
            arrowGuides={arrowGuides}
            labelMode={labelMode}
            showThreatRadar={showThreatRadar}
            onSquareClick={handleSquareClick}
          />

          {/* Minimal Board Preferences Footer */}
          <div className="w-full max-w-[660px] lg:max-w-[700px] flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 border border-stone-800 text-xs sm:text-sm text-stone-300">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-stone-400">Chữ quân:</span>
              {[
                { id: 'vn', label: 'Viết tắt (X, M, P)' },
                { id: 'name', label: 'Tên đầy đủ (Xe, Mã)' },
                { id: 'hanzi', label: 'Chữ Hán (帥, 將)' },
                { id: 'dual', label: 'R/X' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLabelMode(item.id as PieceLabelMode)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    labelMode === item.id
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'bg-stone-950/70 hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowThreatRadar((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                showThreatRadar
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-stone-950/70 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Radar Căn</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN (5 cols): Single Unified Card with 2 Tabs */}
        <section className="lg:col-span-5 bg-stone-900/95 border border-stone-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Top 2-Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-stone-800 bg-stone-950/60 p-1.5 gap-1.5">
            <button
              type="button"
              onClick={() => setRightTab('train')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                rightTab === 'train'
                  ? 'bg-stone-800 text-amber-300 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Bài Đang Học</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTab('roadmap')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                rightTab === 'roadmap'
                  ? 'bg-stone-800 text-amber-300 shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Lộ Trình 4 Cấp ({completedIds.length}/23)</span>
            </button>
          </div>

          {/* TAB 1: FOCUSED ACTIVE TRAINING VIEW */}
          {rightTab === 'train' && (
            <div className="p-4 sm:p-5 space-y-4 sm:space-y-4.5">
              {/* Prev / Next Lesson Stepper Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-amber-400">
                  {isSparringBot
                    ? '🤖 Đấu Tập Tự Do Với Bot'
                    : `Tầng ${currentLesson.tier} • Bài ${currentLessonIndex + 1}/23`}
                </span>

                {!isSparringBot && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentLessonIndex <= 0}
                      onClick={handlePrevLesson}
                      className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                      title="Bài trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentLessonIndex >= MASTERY_LESSONS.length - 1}
                      onClick={handleNextLesson}
                      className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                      title="Bài tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Lesson Title & Concise Objective */}
              <div>
                <h2 className="font-black text-base sm:text-lg text-stone-100 leading-snug">
                  {isSparringBot
                    ? 'Thực Chiến Với AI Bot (Có Move Coach)'
                    : currentLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed bg-stone-950/70 p-3 sm:p-3.5 rounded-xl border border-stone-800/80">
                  {isSparringBot
                    ? 'Triển khai khai cuộc chuẩn và tránh đi sót nước mất quân.'
                    : currentLesson.objective}
                </p>
              </div>

              {/* Clean Action Toolbar: Hint, Timer, Reset */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!isSparringBot && (
                    <button
                      type="button"
                      onClick={() =>
                        setHintLevel((prev) =>
                          prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 3
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-500/40 text-blue-200 text-xs sm:text-sm font-bold transition cursor-pointer"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Gợi ý ({hintLevel}/3)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      resetCurrentBoard(currentLesson, isSparringBot)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs sm:text-sm font-bold transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm lại</span>
                  </button>
                </div>

                {!isSparringBot && timeLeft !== null && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm ${
                      timeLeft <= 20
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                        : 'bg-stone-950 border-stone-800 text-amber-300'
                    }`}
                  >
                    <Timer className="w-4 h-4" />
                    <span>
                      {Math.floor(timeLeft / 60)}:
                      {String(timeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              {/* Active Hint Display (Only shows latest unlocked hint to avoid clutter) */}
              {!isSparringBot && hintLevel > 0 && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/50 text-xs sm:text-sm text-blue-200 leading-relaxed font-medium">
                  💡 {currentLesson.hints[hintLevel - 1]}
                </div>
              )}

              {/* Blocked Piece Alert */}
              {blockedInfos.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs sm:text-sm text-rose-200 flex items-center gap-2 font-medium">
                  <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{blockedInfos[0].description}</span>
                </div>
              )}

              {/* Victory Banner */}
              {lessonCompleted && (
                <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="font-bold text-xs sm:text-sm text-emerald-200">
                      Hoàn thành xuất sắc! (+{currentLesson.expReward} EXP)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextLesson}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm shrink-0 transition cursor-pointer"
                  >
                    Bài tiếp →
                  </button>
                </div>
              )}

              {/* Move Coach & Compact Notation */}
              <div className="pt-2 border-t border-stone-800/80">
                <MoveCoachPanel
                  latestFeedback={latestFeedback}
                  moveHistory={moveHistory}
                  lessonTheory={currentLesson.theory}
                  lessonCitation={currentLesson.citation}
                />
              </div>
            </div>
          )}

          {/* TAB 2: 4-TIER ROADMAP & MODES */}
          {rightTab === 'roadmap' && (
            <div className="p-4 sm:p-5 space-y-3.5">
              {/* 4 Tier Pills */}
              <div className="grid grid-cols-4 gap-1.5">
                {TIER_METADATA.map((t) => (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => setActiveTier(t.tier)}
                    className={`py-2 px-2 rounded-xl border text-center text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTier === t.tier
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Cấp {t.tier}
                  </button>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-stone-300 px-1">
                {TIER_METADATA[activeTier - 1].goal}
              </p>

              {/* Lesson List */}
              <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                {lessonsInActiveTier.map((lesson) => {
                  const isSelected =
                    !isSparringBot && lesson.id === currentLesson.id;
                  const isDone = completedIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setIsSparringBot(false);
                        setIsDailyChallengeMode(false);
                        setActiveLessonId(lesson.id);
                        setRightTab('train');
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                          : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:bg-stone-800/60'
                      }`}
                    >
                      <span className="font-semibold text-xs sm:text-sm line-clamp-1">
                        {lesson.title}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-stone-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Extra Tools: Bot Sparring & Piece Value Table */}
              <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSparringBot(true);
                    setRightTab('train');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Đấu Với Bot</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPieceValueTable((prev) => !prev)}
                  className="py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs sm:text-sm font-bold text-stone-300 transition cursor-pointer"
                >
                  {showPieceValueTable ? 'Ẩn Bảng Điểm' : 'Bảng Điểm Quân'}
                </button>
              </div>

              {showPieceValueTable && (
                <div className="rounded-xl bg-stone-950 border border-stone-800 p-3 text-xs sm:text-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400">
                        <th className="pb-1.5">Quân</th>
                        <th className="pb-1.5">Khai/Trung</th>
                        <th className="pb-1.5">Cờ Tàn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900">
                      {Object.values(PIECE_VALUES).map((pv) => (
                        <tr key={pv.codeVn}>
                          <td className="py-1.5 font-semibold text-stone-200">
                            {pv.nameVi} ({pv.codeVn})
                          </td>
                          <td className="py-1.5 text-emerald-400 font-bold">
                            {pv.basePoints === 1000 ? 'Vô giá' : `${pv.basePoints}đ`}
                          </td>
                          <td className="py-1.5 text-cyan-400 font-bold">
                            {pv.endgamePoints === 1000
                              ? 'Vô giá'
                              : `${pv.endgamePoints}đ`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <GrandmasterCoachModal
        isOpen={isGrandmasterOpen}
        onClose={() => setIsGrandmasterOpen(false)}
        currentBoard={board}
        currentLessonTitle={currentLesson.title}
        onSelectTierLesson={(tier, lessonId) => {
          setIsSparringBot(false);
          setIsDailyChallengeMode(false);
          setActiveTier(tier as 1 | 2 | 3 | 4);
          setActiveLessonId(lessonId);
          setRightTab('train');
        }}
        onAwardExp={awardExp}
      />
    </div>
  );
};

export default App;
