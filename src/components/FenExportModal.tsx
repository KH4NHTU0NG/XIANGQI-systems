import React, { useState } from 'react';
import { Copy, Check, X, Share2, Upload } from 'lucide-react';
import { BoardMatrix, Side, toFEN, parseFEN } from '../engine/xiangqiEngine';

interface FenExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: BoardMatrix;
  turn: Side;
  moveHistory: { ply: number; notation: string; side: 'r' | 'b' }[];
  onLoadCustomFen: (board: BoardMatrix, turn: Side) => void;
}

export const FenExportModal: React.FC<FenExportModalProps> = ({
  isOpen,
  onClose,
  board,
  turn,
  moveHistory,
  onLoadCustomFen,
}) => {
  const currentFen = toFEN(board, turn);
  const [copiedFen, setCopiedFen] = useState<boolean>(false);
  const [copiedPgn, setCopiedPgn] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [fenError, setFenError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format standard move notation string
  const pgnText = moveHistory
    .reduce<string[]>((acc, m, idx) => {
      if (idx % 2 === 0) {
        acc.push(`${Math.floor(idx / 2) + 1}. ${m.notation}`);
      } else {
        acc[acc.length - 1] += ` ${m.notation}`;
      }
      return acc;
    }, [])
    .join('  ');

  const handleCopyFen = () => {
    navigator.clipboard.writeText(currentFen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  const handleCopyPgn = () => {
    navigator.clipboard.writeText(pgnText || 'Chưa có nước đi');
    setCopiedPgn(true);
    setTimeout(() => setCopiedPgn(false), 2000);
  };

  const handleApplyCustomFen = () => {
    setFenError(null);
    try {
      const trimmed = customInput.trim();
      if (!trimmed) {
        setFenError('Vui lòng nhập chuỗi FEN hợp lệ.');
        return;
      }
      const parsed = parseFEN(trimmed);

      // Validate presence of both Kings
      let redKing = 0;
      let blackKing = 0;
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          const p = parsed.board[r][c];
          if (p?.type === 'K') {
            if (p.side === 'r') redKing++;
            if (p.side === 'b') blackKing++;
          }
        }
      }

      if (redKing !== 1 || blackKing !== 1) {
        setFenError('Thế cờ phải có đúng 1 Tướng Đỏ và 1 Tướng Đen!');
        return;
      }

      onLoadCustomFen(parsed.board, parsed.turn);
      onClose();
    } catch {
      setFenError('Định dạng FEN không hợp lệ. Vui lòng kiểm tra lại cấu trúc.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#191411] border border-[#423427] rounded-2xl shadow-2xl overflow-hidden font-serif">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#382a20] bg-[#14100d]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#dfb673]" />
            <h3 className="font-serif font-bold text-base text-[#f0e6d6]">
              Kỳ Phổ FEN & Biên Bản Ván Đấu
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#9c8975] hover:text-[#e2dad0] hover:bg-[#251d18] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Current FEN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#a89886]">
              <span className="font-semibold">Chuỗi FEN hiện tại:</span>
              <button
                type="button"
                onClick={handleCopyFen}
                className="flex items-center gap-1 text-[#dfb673] hover:text-[#fae5a8] font-bold cursor-pointer transition"
              >
                {copiedFen ? <Check className="w-3.5 h-3.5 text-[#86efac]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFen ? 'Đã sao chép' : 'Sao chép FEN'}</span>
              </button>
            </div>
            <div className="p-3 bg-[#110e0c] rounded-xl border border-[#33251a] font-mono text-xs text-[#cfc2b0] break-all select-all">
              {currentFen}
            </div>
          </div>

          {/* Move History PGN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[#a89886]">
              <span className="font-semibold">Biên bản nước đi (Kỳ Lục):</span>
              <button
                type="button"
                onClick={handleCopyPgn}
                className="flex items-center gap-1 text-[#dfb673] hover:text-[#fae5a8] font-bold cursor-pointer transition"
              >
                {copiedPgn ? <Check className="w-3.5 h-3.5 text-[#86efac]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPgn ? 'Đã sao chép' : 'Sao chép biên bản'}</span>
              </button>
            </div>
            <div className="p-3 bg-[#110e0c] rounded-xl border border-[#33251a] font-mono text-xs text-[#cfc2b0] min-h-[50px] max-h-[100px] overflow-y-auto select-all">
              {pgnText || <span className="italic text-[#635546]">Chưa có nước đi trong ván đấu này</span>}
            </div>
          </div>

          {/* Import Custom FEN */}
          <div className="pt-2 border-t border-[#33251a] space-y-2">
            <span className="font-semibold text-[#a89886] block">
              Tải thế cờ tùy chỉnh (Nhập chuỗi FEN):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Dán chuỗi FEN cờ tướng vào đây..."
                className="flex-1 px-3 py-2 bg-[#120f0d] border border-[#3d2e21] rounded-xl text-xs font-mono text-[#f0e6d6] focus:outline-none focus:border-[#dfb673]"
              />
              <button
                type="button"
                onClick={handleApplyCustomFen}
                className="px-3.5 py-2 bg-[#8c221e] hover:bg-[#a62b27] text-[#fcedc7] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nạp thế cờ</span>
              </button>
            </div>
            {fenError && (
              <p className="text-xs text-[#f87171] bg-[#2e1614] border border-[#59221e] p-2 rounded-lg">
                ⚠️ {fenError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

