import React, { useState } from 'react';
import { BoardMatrix, boardToAscii } from '../engine/xiangqiEngine';
import {
  GraduationCap,
  X,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Terminal,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface GrandmasterCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoard: BoardMatrix;
  currentLessonTitle: string;
  onSelectTierLesson: (tier: number, lessonId: string) => void;
  onAwardExp: (amount: number) => void;
}

interface DiagnosticQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    question:
      'Câu 1 (Ký hiệu & Tọa độ Việt Nam): Khi cầm quân Đỏ (Tiên), nước đi "P2-5" và "M8.7" có ý nghĩa chính xác là gì?',
    options: [
      'Pháo ở cột 2 (tính từ phải qua trái) bình vào trung lộ 5; Mã ở cột 8 tiến lên cột 7.',
      'Pháo ở cột 2 (tính từ trái qua phải) tiến 5 bước; Mã ở cột 8 lùi về cột 7.',
      'Pháo ăn Tốt ở lộ 5; Mã nhảy xuống Ngọa Tào lộ 8.',
    ],
    correctIdx: 0,
    explanation:
      'Chuẩn xác! Trong Cờ Tướng Việt Nam, bên Tiên (Đỏ) đếm số lộ từ phải qua trái (1–9), bên Hậu (Đen) đếm từ trái qua phải (1–9). Dấu "-" là bình (đi ngang), "." là tấn (tiến), "/" là thoái (lùi) [1][2].',
  },
  {
    id: 2,
    question:
      'Câu 2 (Luật Đặc Thù): Trong trường hợp nào quân Mã và quân Tượng KHÔNG THỂ thực hiện nước nhảy dù ô đích hoàn toàn trống?',
    options: [
      'Khi Tướng đang ở lộ 4 hoặc lộ 6.',
      'Khi ô sát cạnh theo hướng đi thẳng của Mã có quân đứng (Cản chân Mã) hoặc tâm hình chữ Điền của Tượng có quân đứng (Chặn mắt Tượng).',
      'Khi Pháo đối phương đang đóng ở trung lộ 5.',
    ],
    correctIdx: 1,
    explanation:
      'Hoàn toàn chính xác! Khác với Cờ Vua, Mã Cờ Tướng bị "Biệt Mã Cước" (Cản chân Mã) và Tượng bị "Điền Tượng Nhãn" (Chặn mắt Tượng) kèm giới hạn Tượng không được qua sông [1].',
  },
  {
    id: 3,
    question:
      'Câu 3 (Tư Duy Sát Pháp): Khi bị đối phương chiếu bằng đòn "Lưỡng Chiếu" (Chiếu Đôi - 2 quân cùng chiếu Tướng một lúc), cách hóa giải duy nhất hợp lệ là gì?',
    options: [
      'Dùng Sĩ hoặc Tượng ăn một trong hai quân đang chiếu.',
      'Đưa một quân lớn (Xe/Pháo) vào kê cản ở trung lộ.',
      'Bắt buộc phải di chuyển Tướng sang ô an toàn (không thể ăn quân chiếu hay kê quân cản vì vẫn còn quân thứ hai đang chiếu).',
    ],
    correctIdx: 2,
    explanation:
      'Tuyệt vời! Khi bị Lưỡng Chiếu, việc ăn 1 quân hoặc kê cản 1 đường chiếu không thể đồng thời giải tỏa đường chiếu của quân thứ hai. Do đó Tướng bắt buộc phải tự di chuyển [3].',
  },
];

export const GrandmasterCoachModal: React.FC<GrandmasterCoachModalProps> = ({
  isOpen,
  onClose,
  currentBoard,
  currentLessonTitle,
  onSelectTierLesson,
  onAwardExp,
}) => {
  const [mode, setMode] = useState<'welcome' | 'quiz' | 'ascii'>('welcome');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copiedAscii, setCopiedAscii] = useState(false);

  if (!isOpen) return null;

  const asciiString = boardToAscii(currentBoard);

  const score = DIAGNOSTIC_QUESTIONS.reduce(
    (acc, q) => (answers[q.id] === q.correctIdx ? acc + 1 : acc),
    0
  );

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(asciiString);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handleFinishQuiz = () => {
    if (!quizSubmitted) {
      setQuizSubmitted(true);
      onAwardExp(score * 30 + 20);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-stone-900 border-2 border-amber-600/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-950 via-stone-900 to-stone-900 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-200">
                Đặc Cấp Quốc Tế Đại Sư — Huấn Luyện Viên 1-1 (Prompt B)
              </h2>
              <p className="text-xs text-stone-400">
                Chuẩn ký hiệu Việt Nam (`P2-5`, `M8.7`, `X1/2`) • Bàn cờ ASCII
                trực quan • Kiểm tra đầu vào
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('welcome')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'welcome'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            1. Phiên Huấn Luyện 1-1
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'quiz'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            2. Kiểm Tra Trình Độ Đầu Vào (3 Câu Hỏi)
          </button>
          <button
            type="button"
            onClick={() => setMode('ascii')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'ascii'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            3. Sơ Đồ Bàn Cờ ASCII/Text Hiện Tại
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {mode === 'welcome' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-700/40 text-stone-200 leading-relaxed">
                <p className="font-bold text-amber-300 text-base mb-2">
                  👋 Chào mừng đệ tử! Ta là Đặc Cấp Quốc Tế Đại Sư Cờ Tướng.
                </p>
                <p className="text-xs sm:text-sm text-stone-300">
                  Theo phương pháp huấn luyện <strong>"Học Sát Pháp & Cờ Tàn trước, học Khai Cuộc sau"</strong>,
                  mỗi buổi học của chúng ta gồm 3 bước chặt chẽ:{' '}
                  <span className="text-amber-300 font-semibold">
                    (a) Lý thuyết cốt lõi ngắn gọn → (b) Ví dụ minh họa trên bàn
                    cờ → (c) Bài tập tình huống thực tế có chấm điểm Move Coach.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Lựa chọn A
                    </span>
                    <h3 className="font-bold text-stone-100 text-base mt-1">
                      Kiểm tra trình độ đầu vào (3 câu hỏi nhanh)
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Đánh giá khả năng đọc ký hiệu tọa độ Việt Nam, luật cản
                      quân và phản xạ sát pháp để Đại Sư xếp đúng tầng học cho
                      bạn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode('quiz')}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Làm Bài Kiểm Tra Đầu Vào Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Lựa chọn B
                    </span>
                    <h3 className="font-bold text-stone-100 text-base mt-1">
                      Vào thẳng Bài 1 của Cấp độ 1 (Nhập Môn)
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Bắt đầu ngay từ nền tảng: Quy tắc Cản chân Mã (Biệt Mã
                      Cước), Chặn mắt Tượng, Lộ mặt Tướng và chiếu bí trong 1
                      nước.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTierLesson(1, 'T1-01');
                      onClose();
                    }}
                    className="mt-4 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Vào Thẳng Bài 1 - Cấp Độ 1</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div className="space-y-4">
              {DIAGNOSTIC_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5"
                >
                  <p className="font-bold text-stone-100 text-xs sm:text-sm">
                    {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[q.id] === idx;
                      const isCorrect = idx === q.correctIdx;
                      let btnStyle =
                        'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-950/70 border-emerald-500 text-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle =
                            'bg-rose-950/70 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle =
                          'bg-amber-950/60 border-amber-500 text-amber-200';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: idx }))
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="p-2.5 rounded-lg bg-stone-900/90 border border-stone-800 text-xs text-amber-300">
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={Object.keys(answers).length < 3}
                  onClick={handleFinishQuiz}
                  className="w-full py-2.5 rounded-xl bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-extrabold text-xs transition cursor-pointer"
                >
                  Nộp Bài Kiểm Tra & Nhận Đánh Giá Từ Đại Sư
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-emerald-300 text-sm">
                      Kết quả: {score}/3 câu đúng (+{score * 30 + 20} EXP)
                    </h4>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {score === 3
                        ? 'Nền tảng tuyệt vời! Đại Sư khuyên bạn tiến thẳng vào Tầng 2 (10 Sát Pháp Cơ Bản).'
                        : 'Hãy bắt đầu từ Tầng 1 (Nhập Môn & Cảm Giác Quân) để nắm chắc luật cản quân và tọa độ.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (score === 3) {
                        onSelectTierLesson(2, 'T2-01');
                      } else {
                        onSelectTierLesson(1, 'T1-01');
                      }
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition cursor-pointer"
                  >
                    Đến Bài Học Được Đề Xuất →
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'ascii' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <span>
                    Sơ đồ ASCII thời gian thực của thế cờ:{' '}
                    <strong className="text-amber-300">
                      {currentLessonTitle}
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAscii}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-amber-300 transition cursor-pointer"
                >
                  {copiedAscii ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã sao chép ASCII</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép bàn cờ ASCII</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-[11px] sm:text-xs font-mono text-amber-200/95 overflow-x-auto leading-snug">
                {asciiString}
              </pre>
              <p className="text-[11px] text-stone-400">
                Chú thích: Chữ IN HOA (`TG, S, T, X, P, M, B`) là quân Đỏ
                (Tiên); chữ thường (`tg, s, t, x, p, m, b`) là quân Đen (Hậu).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

