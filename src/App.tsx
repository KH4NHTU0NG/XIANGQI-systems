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
  isKingInCheck,
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
import { XiangqiBoard3D } from './components/XiangqiBoard3D';
import { MoveCoachPanel, MoveRecord } from './components/MoveCoachPanel';
import { GamificationBar } from './components/GamificationBar';
import { GrandmasterCoachModal } from './components/GrandmasterCoachModal';
import { FenExportModal } from './components/FenExportModal';
import { soundEngine } from './audio/soundEngine';
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
  Volume2,
  VolumeX,
  Share2,
  Box,
} from 'lucide-react';

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
  const [isFenModalOpen, setIsFenModalOpen] = useState<boolean>(false);

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
  const [activePlyIndex, setActivePlyIndex] = useState<number | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);

  // Display & Hint Controls (Default clean Vietnamese symbol mode + 3D WebGL Mode)
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [labelMode, setLabelMode] = useState<PieceLabelMode>('vn');
  const [showThreatRadar, setShowThreatRadar] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.getMuted());
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
      setActivePlyIndex(null);
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
    if (activePlyIndex !== null) {
      setActivePlyIndex(null); // Click anywhere to return to live position
      return;
    }
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

    const isCapture = Boolean(board[move.to.r][move.to.c]);

    if (isSparringBot) {
      if (isCapture) {
        soundEngine.playCapture();
      } else {
        soundEngine.playMove();
      }

      const feedback = evaluateMoveCoach(board, move);
      const nextBoard = makeMoveOnBoard(board, move.from, move.to);
      setBoard(nextBoard);
      setLastMove({ from: move.from, to: move.to });
      setLatestFeedback(feedback);
      setActivePlyIndex(null);
      setMoveHistory((prev) => [
        ...prev,
        {
          ply: prev.length + 1,
          side: 'r',
          notation: move.vnNotation,
          quality: feedback.quality,
          feedback,
          boardSnapshot: nextBoard,
          from: move.from,
          to: move.to,
        },
      ]);

      if (isKingInCheck(nextBoard, 'b')) {
        soundEngine.playCheck();
      }

      if (isCheckmateOrNoMoves(nextBoard, 'b')) {
        soundEngine.playVictory();
        setLessonCompleted(true);
        awardExp(100);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        return;
      }

      setTurn('b');
      window.setTimeout(() => {
        const { move: botMove } = findBestMove(nextBoard, 'b', 2);
        if (botMove) {
          const isBotCapture = Boolean(nextBoard[botMove.to.r][botMove.to.c]);
          if (isBotCapture) {
            soundEngine.playCapture();
          } else {
            soundEngine.playMove();
          }

          const afterBot = makeMoveOnBoard(nextBoard, botMove.from, botMove.to);
          setBoard(afterBot);
          setLastMove({ from: botMove.from, to: botMove.to });
          setActivePlyIndex(null);
          setMoveHistory((prev) => [
            ...prev,
            {
              ply: prev.length + 1,
              side: 'b',
              notation: botMove.vnNotation,
              boardSnapshot: afterBot,
              from: botMove.from,
              to: botMove.to,
            },
          ]);

          if (isKingInCheck(afterBot, 'r')) {
            soundEngine.playCheck();
          }

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

    if (isCapture) {
      soundEngine.playCapture();
    } else {
      soundEngine.playMove();
    }

    const nextBoard = makeMoveOnBoard(board, move.from, move.to);
    setBoard(nextBoard);
    setLastMove({ from: move.from, to: move.to });
    setLatestFeedback(feedback);
    setActivePlyIndex(null);
    setMoveHistory((prev) => [
      ...prev,
      {
        ply: prev.length + 1,
        side: 'r',
        notation: move.vnNotation,
        quality: feedback.quality,
        feedback,
        boardSnapshot: nextBoard,
        from: move.from,
        to: move.to,
      },
    ]);

    if (isKingInCheck(nextBoard, 'b')) {
      soundEngine.playCheck();
    }

    if (expectedStep.opponentReply) {
      setTurn('b');
      const reply = expectedStep.opponentReply;
      window.setTimeout(() => {
        const isReplyCapture = Boolean(nextBoard[reply.from.r][reply.from.c]);
        if (isReplyCapture) {
          soundEngine.playCapture();
        } else {
          soundEngine.playMove();
        }

        const afterReply = makeMoveOnBoard(nextBoard, reply.from, reply.to);
        setBoard(afterReply);
        setLastMove({ from: reply.from, to: reply.to });
        setActivePlyIndex(null);
        setMoveHistory((prev) => [
          ...prev,
          {
            ply: prev.length + 1,
            side: 'b',
            notation: reply.notation,
            boardSnapshot: afterReply,
            from: reply.from,
            to: reply.to,
          },
        ]);

        if (isKingInCheck(afterReply, 'r')) {
          soundEngine.playCheck();
        }

        setTurn('r');
        setStepIndex((prev) => prev + 1);
      }, 380);
    } else if (stepIndex + 1 < currentLesson.steps.length) {
      setStepIndex((prev) => prev + 1);
    } else {
      soundEngine.playVictory();
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

  const displayBoard =
    activePlyIndex !== null && moveHistory[activePlyIndex]?.boardSnapshot
      ? moveHistory[activePlyIndex].boardSnapshot!
      : board;

  const displayLastMove =
    activePlyIndex !== null &&
    moveHistory[activePlyIndex]?.from &&
    moveHistory[activePlyIndex]?.to
      ? {
          from: moveHistory[activePlyIndex].from!,
          to: moveHistory[activePlyIndex].to!,
        }
      : lastMove;

  return (
    <div className="min-h-screen flex flex-col bg-[#12100e] text-[#e6ded3]">
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
        {/* LEFT COLUMN (7 cols): Clean, Spacious Chessboard (3D PBR WebGL or 2D Classical) + Footer Controls */}
        <section className="lg:col-span-7 flex flex-col items-center gap-3">
          {is3DMode ? (
            <XiangqiBoard3D
              board={displayBoard}
              turn={turn}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              blockedInfos={blockedInfos}
              lastMove={displayLastMove}
              arrowGuides={arrowGuides}
              labelMode={labelMode}
              showThreatRadar={showThreatRadar}
              onSquareClick={handleSquareClick}
            />
          ) : (
            <XiangqiBoard
              board={displayBoard}
              turn={turn}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              blockedInfos={blockedInfos}
              lastMove={displayLastMove}
              arrowGuides={arrowGuides}
              labelMode={labelMode}
              showThreatRadar={showThreatRadar}
              onSquareClick={handleSquareClick}
            />
          )}

          {/* Minimal Board Preferences Footer */}
          <div className="w-full max-w-[660px] lg:max-w-[700px] flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl bg-[#1c1714] border border-[#3d2f23] text-xs sm:text-sm text-[#e6ded2]">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIs3DMode((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-black transition cursor-pointer ${
                  is3DMode
                    ? 'bg-gradient-to-r from-[#b83833] to-[#8c221e] text-[#fcedc7] border border-[#dfb673]/50 shadow'
                    : 'bg-[#241c17] hover:bg-[#33261e] text-[#f6d28b] border border-[#443528]'
                }`}
                title="Chuyển đổi giữa Sa bàn 3D PBR WebGL và Sa bàn 2D Cổ Điển"
              >
                <Box className="w-4 h-4" />
                <span>{is3DMode ? 'Chế độ: 3D PBR' : 'Chế độ: 2D Phẳng'}</span>
              </button>

              <span className="font-serif font-bold text-[#b8a794] ml-1">Chữ:</span>
              {[
                { id: 'vn', label: 'X, M, P' },
                { id: 'name', label: 'Xe, Mã' },
                { id: 'hanzi', label: '帥, 將' },
                { id: 'dual', label: 'R/X' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLabelMode(item.id as PieceLabelMode)}
                  className={`px-2.5 py-1.5 rounded-lg font-serif font-bold transition cursor-pointer ${
                    labelMode === item.id
                      ? 'bg-[#dfb673] text-[#1a1107] shadow-sm'
                      : 'bg-[#241c17] hover:bg-[#33261e] text-[#e6ded2] border border-[#3a2c20]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const muted = soundEngine.toggleMute();
                  setIsMuted(muted);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-bold transition cursor-pointer ${
                  !isMuted
                    ? 'bg-[#2a221b] border border-[#4a3b2d] text-[#f6d28b]'
                    : 'bg-[#241c17] text-[#998675] border border-[#3a2c20]'
                }`}
                title={isMuted ? 'Bật âm thanh sa bàn' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#8c221e]" /> : <Volume2 className="w-4 h-4 text-[#dfb673]" />}
                <span className="hidden sm:inline">{isMuted ? 'Âm: Tắt' : 'Âm: Bật'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFenModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-bold transition cursor-pointer bg-[#241c17] hover:bg-[#33261e] text-[#f6d28b] border border-[#3a2c20]"
                title="Xuất / Nhập chuỗi FEN và Kỳ Lục"
              >
                <Share2 className="w-4 h-4" />
                <span>FEN</span>
              </button>

              <button
                type="button"
                onClick={() => setShowThreatRadar((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-bold transition cursor-pointer ${
                  showThreatRadar
                    ? 'bg-[#8c221e] text-[#fcedc7] shadow-sm border border-[#b83833]'
                    : 'bg-[#241c17] hover:bg-[#33261e] text-[#e6ded2] border border-[#3a2c20]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Radar Căn</span>
              </button>

              <a
                href="/xiangqi-3d.html"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-serif font-black transition cursor-pointer bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] text-[#1c1209] shadow-md border border-[#fde68a]/60"
                title="Mở Game Cờ Tướng 3D Tu Tiên Toàn Màn Hình (Chinese Chess 3D Invincible)"
              >
                <span>⚔️ 3D Tu Tiên Toàn Cảnh</span>
              </a>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (5 cols): Single Unified Card with 2 Tabs */}
        <section className="lg:col-span-5 bg-[#191411] border border-[#3d2e23] rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Top 2-Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-[#382b20] bg-[#14100d] p-1.5 gap-1.5 font-serif">
            <button
              type="button"
              onClick={() => setRightTab('train')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                rightTab === 'train'
                  ? 'bg-[#2b211a] text-[#f6d28b] shadow border border-[#524032]'
                  : 'text-[#b8a794] hover:text-[#fae5a8]'
              }`}
            >
              <Target className="w-4 h-4 text-[#dfb673]" />
              <span>Thế Cờ Đang Luyện</span>
            </button>
            <button
              type="button"
              onClick={() => setRightTab('roadmap')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                rightTab === 'roadmap'
                  ? 'bg-[#2b211a] text-[#f6d28b] shadow border border-[#524032]'
                  : 'text-[#b8a794] hover:text-[#fae5a8]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#dfb673]" />
              <span>Kỳ Phổ 4 Tầng ({completedIds.length}/{MASTERY_LESSONS.length})</span>
            </button>
          </div>

          {/* TAB 1: FOCUSED ACTIVE TRAINING VIEW */}
          {rightTab === 'train' && (
            <div className="p-4 sm:p-5 space-y-4 sm:space-y-4.5">
              {/* Prev / Next Lesson Stepper Header */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-serif font-bold px-3.5 py-1.5 rounded-lg bg-[#221a15] border border-[#443528] text-[#f6d28b]">
                  {isSparringBot
                    ? 'Kỳ Đạo Sa Bàn • Đối Kháng Tự Do'
                    : `Tầng ${currentLesson.tier} • Bài ${currentLessonIndex + 1}/${MASTERY_LESSONS.length}`}
                </span>

                {!isSparringBot && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentLessonIndex <= 0}
                      onClick={handlePrevLesson}
                      className="p-1.5 rounded-lg bg-[#241c16] border border-[#443528] text-[#f5eee6] hover:bg-[#332720] disabled:opacity-30 cursor-pointer"
                      title="Bài trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentLessonIndex >= MASTERY_LESSONS.length - 1}
                      onClick={handleNextLesson}
                      className="p-1.5 rounded-lg bg-[#241c16] border border-[#443528] text-[#f5eee6] hover:bg-[#332720] disabled:opacity-30 cursor-pointer"
                      title="Bài tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Lesson Title & Concise Objective */}
              <div>
                <h2 className="font-serif font-black text-base sm:text-lg text-[#fef9f2] leading-snug">
                  {isSparringBot
                    ? 'Thực Chiến Sa Bàn (Có Bình Chú Nước Đi)'
                    : currentLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#e6ded2] mt-2.5 leading-relaxed bg-[#14100d] p-3.5 rounded-xl border border-[#382b20] font-serif">
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
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1d291e] hover:bg-[#253826] border border-[#385c3b] text-[#86efac] text-xs sm:text-sm font-serif font-bold transition cursor-pointer shadow-sm"
                    >
                      <Lightbulb className="w-4 h-4 text-[#dfb673]" />
                      <span>Manh mối ({hintLevel}/3)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      resetCurrentBoard(currentLesson, isSparringBot)
                    }
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#241c16] hover:bg-[#332720] border border-[#443528] text-[#f5eee6] text-xs sm:text-sm font-serif font-bold transition cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Lập lại cờ</span>
                  </button>
                </div>

                {!isSparringBot && timeLeft !== null && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm ${
                      timeLeft <= 20
                        ? 'bg-[#3b1715] border-[#8c221e] text-[#fca5a5]'
                        : 'bg-[#221a15] border-[#3d2f23] text-[#dfb673]'
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

              {/* Active Hint Display */}
              {!isSparringBot && hintLevel > 0 && (
                <div className="p-3.5 rounded-xl bg-[#1d2b1f] border border-[#3b5e3d] text-xs sm:text-sm text-[#bbf7d0] leading-relaxed font-serif">
                  📜 {currentLesson.hints[hintLevel - 1]}
                </div>
              )}

              {/* Blocked Piece Alert */}
              {blockedInfos.length > 0 && (
                <div className="p-3 rounded-xl bg-[#2e1816] border border-[#5c2320] text-xs sm:text-sm text-[#fca5a5] flex items-center gap-2 font-serif">
                  <Shield className="w-4 h-4 text-[#f87171] shrink-0" />
                  <span>{blockedInfos[0].description}</span>
                </div>
              )}

              {/* Victory Banner */}
              {lessonCompleted && (
                <div className="p-3.5 rounded-xl bg-[#1d2e20] border border-[#386b45] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#dfb673] shrink-0" />
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#a7f3d0]">
                      Phá giải hoàn tất! (+{currentLesson.expReward} EXP)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextLesson}
                    className="px-3.5 py-1.5 rounded-lg bg-[#dfb673] hover:bg-[#fae5a8] text-[#1c140d] font-serif font-black text-xs sm:text-sm shrink-0 transition cursor-pointer shadow"
                  >
                    Cục tiếp theo →
                  </button>
                </div>
              )}

              {/* Move Coach & Compact Notation */}
              <div className="pt-2 border-t border-[#382b20]">
                <MoveCoachPanel
                  latestFeedback={latestFeedback}
                  moveHistory={moveHistory}
                  activePlyIndex={activePlyIndex}
                  onSelectPly={setActivePlyIndex}
                  lessonTheory={currentLesson.theory}
                  lessonCitation={currentLesson.citation}
                />
              </div>
            </div>
          )}

          {/* TAB 2: 4-TIER ROADMAP & MODES */}
          {rightTab === 'roadmap' && (
            <div className="p-4 sm:p-5 space-y-4">
              {/* 4 Tier Pills */}
              <div className="grid grid-cols-4 gap-2 font-serif">
                {TIER_METADATA.map((t) => (
                  <button
                    key={t.tier}
                    type="button"
                    onClick={() => setActiveTier(t.tier)}
                    className={`py-2.5 px-2 rounded-xl border text-center text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTier === t.tier
                        ? 'bg-[#dfb673] text-[#1a1107] border-[#dfb673] shadow-md font-black'
                        : 'bg-[#221a15] border-[#3d2f23] text-[#cbbdaf] hover:text-[#fae5a8]'
                    }`}
                  >
                    Tầng {t.tier}
                  </button>
                ))}
              </div>

              <p className="text-sm text-[#d6c7b5] px-1 font-serif leading-relaxed">
                {TIER_METADATA[activeTier - 1].goal}
              </p>

              {/* Lesson List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
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
                      className={`w-full text-left px-4 py-3 rounded-xl border transition flex items-center justify-between gap-2.5 cursor-pointer font-serif ${
                        isSelected
                          ? 'bg-[#2e2118] border-[#dfb673] text-[#fae5a8] shadow-sm'
                          : 'bg-[#1b1512] border-[#382b20] text-[#f5eee6] hover:bg-[#281f19]'
                      }`}
                    >
                      <span className="font-bold text-sm line-clamp-1">
                        {lesson.title}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#86efac] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#806f5e] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Extra Tools: Bot Sparring & Piece Value Table */}
              <div className="pt-2 border-t border-[#382b20] flex items-center gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => {
                    setIsSparringBot(true);
                    setRightTab('train');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#241c16] hover:bg-[#332720] border border-[#443528] text-xs sm:text-sm font-bold text-[#f6d28b] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Kỳ Đạo Sa Bàn</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPieceValueTable((prev) => !prev)}
                  className="py-2.5 px-3.5 rounded-xl bg-[#241c16] hover:bg-[#332720] border border-[#443528] text-xs sm:text-sm font-bold text-[#f5eee6] transition cursor-pointer"
                >
                  {showPieceValueTable ? 'Ẩn Kỳ Biểu' : 'Biểu Điểm Quân'}
                </button>
              </div>

              {showPieceValueTable && (
                <div className="rounded-xl bg-[#14100d] border border-[#3d2f23] p-3.5 text-xs sm:text-sm font-serif">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#382b20] text-[#cbbdaf] font-bold text-xs">
                        <th className="pb-2">Quân cờ</th>
                        <th className="pb-2">Khai/Trung</th>
                        <th className="pb-2">Cờ Tàn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#241b14]">
                      {Object.values(PIECE_VALUES).map((pv) => (
                        <tr key={pv.codeVn}>
                          <td className="py-2 font-bold text-[#faf3ea]">
                            {pv.nameVi} ({pv.codeVn})
                          </td>
                          <td className="py-2 text-[#86efac] font-mono font-bold">
                            {pv.basePoints === 1000 ? 'Vô giá' : `${pv.basePoints}đ`}
                          </td>
                          <td className="py-2 text-[#93c5fd] font-mono font-bold">
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

      <FenExportModal
        isOpen={isFenModalOpen}
        onClose={() => setIsFenModalOpen(false)}
        board={board}
        turn={turn}
        moveHistory={moveHistory}
        onLoadCustomFen={(customBoard, customTurn) => {
          setBoard(customBoard);
          setTurn(customTurn);
          setSelectedSquare(null);
          setLegalMoves([]);
          setBlockedInfos([]);
          setLastMove(null);
          setMoveHistory([]);
          setIsSparringBot(true);
          setRightTab('train');
        }}
      />
    </div>
  );
};

export default App;
