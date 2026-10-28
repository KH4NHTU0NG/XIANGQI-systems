import React, { useState } from 'react';
import { BoardMatrix, boardToAscii } from '../engine/xiangqiEngine';
import {
  X,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Scroll,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-serif">
      <div className="w-full max-w-3xl bg-[#191411] border border-[#4a3b2d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#14100d] border-b border-[#382b20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c221e] border border-[#b83833] flex items-center justify-center text-[#fcedc7] font-serif font-bold text-xl shadow-inner">
              帥
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-[#f0e6d6]">
                Kỳ Viện Đại Sư — Điểm Huyệt Chỉ Đạo
              </h2>
              <p className="text-xs text-[#a89987] font-sans">
                Ký hiệu WXF chuẩn Việt Nam (`P2-5`, `M8.7`, `X1/2`) • Khảo thí nhập môn • Sa bàn ký âm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9c8975] hover:text-[#f4ece1] hover:bg-[#28201a] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#382b20] bg-[#120f0d] px-6 pt-2 gap-2 text-xs font-serif font-bold">
          <button
            type="button"
            onClick={() => setMode('welcome')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'welcome'
                ? 'border-[#dfb673] text-[#dfb673] bg-[#191411]'
                : 'border-transparent text-[#8a7968] hover:text-[#cfc2b0]'
            }`}
          >
            1. Tôn Chỉ Huấn Luyện
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'quiz'
                ? 'border-[#dfb673] text-[#dfb673] bg-[#191411]'
                : 'border-transparent text-[#8a7968] hover:text-[#cfc2b0]'
            }`}
          >
            2. Khảo Thí Nhập Môn (3 Câu)
          </button>
          <button
            type="button"
            onClick={() => setMode('ascii')}
            className={`px-4 py-2.5 rounded-t-lg border-b-2 transition cursor-pointer ${
              mode === 'ascii'
                ? 'border-[#dfb673] text-[#dfb673] bg-[#191411]'
                : 'border-transparent text-[#8a7968] hover:text-[#cfc2b0]'
            }`}
          >
            3. Ký Âm Sa Bàn (ASCII)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {mode === 'welcome' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#241c16] border border-[#473627] text-[#e2dad0] leading-relaxed shadow-sm">
                <p className="font-serif font-bold text-[#dfb673] text-base mb-2">
                  📜 Lời dặn của Đại Sư Cờ Tướng:
                </p>
                <p className="text-xs sm:text-sm text-[#cfc2b0]">
                  Cổ nhân dạy: <strong>"Học Sát Pháp & Cờ Tàn trước, học Khai Cuộc sau"</strong>.
                  Người mới nếu chỉ lo học khai cuộc mà không thấu triệt sát pháp thì khi ưu thế cũng không biết cách kết thúc ván cờ. Mỗi buổi rèn luyện gồm 3 bước:
                  <span className="text-[#dfb673] font-semibold block mt-1">
                    (a) Lý thuyết kỳ đạo ngắn gọn → (b) Sa bàn thực nghiệm trực quan → (c) Tự giải cờ thế có lời bình chú.
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#14100d] border border-[#382b20] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#dfb673]">
                      Lựa chọn 1
                    </span>
                    <h3 className="font-bold text-[#f4ece1] text-base mt-1">
                      Khảo thí nhập môn (3 câu hỏi)
                    </h3>
                    <p className="text-xs text-[#a89987] mt-1.5 leading-relaxed">
                      Đo lường sự am hiểu về ký hiệu tọa độ, luật cản chân Mã/chặn mắt Tượng và đòn Lưỡng chiếu để nhận thưởng EXP.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode('quiz')}
                    className="mt-4 w-full py-2.5 px-4 bg-[#8c221e] hover:bg-[#a62b27] text-[#fcedc7] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>Làm bài khảo thí ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#14100d] border border-[#382b20] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#86efac]">
                      Lựa chọn 2
                    </span>
                    <h3 className="font-bold text-[#f4ece1] text-base mt-1">
                      Vào thẳng Tầng 1: Cảm Giác Quân
                    </h3>
                    <p className="text-xs text-[#a89987] mt-1.5 leading-relaxed">
                      Bắt đầu ngay với Bài 1.1 (Cản Chân Mã & Ngọa Tào 1 Nước) trên bàn cờ tương tác lớn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTierLesson(1, 'T1-01');
                      onClose();
                    }}
                    className="mt-4 w-full py-2.5 px-4 bg-[#2b211a] hover:bg-[#3b2e23] border border-[#4a3a2b] text-[#dfb673] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Luyện tập Bài 1.1</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'quiz' && (
            <div className="space-y-5">
              {DIAGNOSTIC_QUESTIONS.map((q, qIdx) => {
                const userAns = answers[q.id];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctIdx;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-[#14100d] border border-[#382b20] space-y-3"
                  >
                    <h4 className="font-bold text-sm text-[#f4ece1] leading-snug">
                      {q.question}
                    </h4>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAns === optIdx;
                        let optStyle =
                          'bg-[#1e1713] border-[#382b20] text-[#cfc2b0] hover:bg-[#281f19]';

                        if (quizSubmitted) {
                          if (optIdx === q.correctIdx) {
                            optStyle =
                              'bg-[#192b1a] border-[#386b45] text-[#86efac] font-bold';
                          } else if (isChosen && !isCorrect) {
                            optStyle =
                              'bg-[#3b1715] border-[#8c221e] text-[#fca5a5]';
                          }
                        } else if (isChosen) {
                          optStyle =
                            'bg-[#2d2218] border-[#dfb673] text-[#fae5a8] font-bold shadow-sm';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={quizSubmitted}
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [q.id]: optIdx,
                              }))
                            }
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${optStyle}`}
                          >
                            <span className="font-mono font-bold text-[#dfb673] shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span className="leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                          isCorrect
                            ? 'bg-[#192b1a] border border-[#386b45] text-[#86efac]'
                            : 'bg-[#3b1715] border border-[#8c221e] text-[#fca5a5]'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#86efac] mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0 text-[#f87171] mt-0.5" />
                        )}
                        <div>{q.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={
                      Object.keys(answers).length < DIAGNOSTIC_QUESTIONS.length
                    }
                    onClick={handleFinishQuiz}
                    className="w-full py-3 bg-[#8c221e] hover:bg-[#a62b27] text-[#fcedc7] font-bold rounded-xl transition disabled:opacity-40 cursor-pointer shadow"
                  >
                    Nộp Bài Khảo Thí (Chấm Điểm & Thưởng EXP)
                  </button>
                ) : (
                  <div className="w-full p-4 rounded-xl bg-[#201813] border border-[#4a392b] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-base text-[#dfb673]">
                        Kết quả: {score}/{DIAGNOSTIC_QUESTIONS.length} câu chính xác! (+{score * 30 + 20} EXP)
                      </span>
                      <p className="text-xs text-[#a89987] mt-0.5">
                        {score === 3
                          ? 'Xuất sắc! Kỳ lực của bạn đã đạt nền tảng Kiện Tướng.'
                          : 'Tốt lắm! Hãy bắt đầu rèn luyện từ Tầng 1 để kiện toàn căn bản.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTierLesson(1, 'T1-01');
                        onClose();
                      }}
                      className="px-5 py-2.5 bg-[#dfb673] hover:bg-[#fae5a8] text-[#1c140d] font-bold text-xs rounded-xl transition cursor-pointer shadow shrink-0"
                    >
                      Bắt đầu luyện tập →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'ascii' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#a89987]">
                  Sa bàn đang học: <strong className="text-[#f4ece1]">{currentLessonTitle}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopyAscii}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241c16] hover:bg-[#33271f] text-[#dfb673] border border-[#4a392b] text-xs font-bold transition cursor-pointer"
                >
                  {copiedAscii ? (
                    <Check className="w-3.5 h-3.5 text-[#86efac]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedAscii ? 'Đã sao chép' : 'Sao chép ASCII'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0d0a08] border border-[#33251a] font-mono text-xs sm:text-sm text-[#cfc2b0] overflow-x-auto leading-tight select-all">
                {asciiString}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
