import React from 'react';
import {
  BoardMatrix,
  Coord,
  Move,
  BlockedInfo,
  PIECE_VALUES,
  Side,
  PieceType,
  findThreatenedPieces,
  isKingInCheck,
  findKing,
} from '../engine/xiangqiEngine';

export type PieceLabelMode = 'vn' | 'name' | 'hanzi' | 'dual';

export interface ArrowGuide {
  from: Coord;
  to: Coord;
  color?: string;
  label?: string;
}

interface XiangqiBoardProps {
  board: BoardMatrix;
  turn: Side;
  selectedSquare: Coord | null;
  legalMoves: Move[];
  blockedInfos: BlockedInfo[];
  lastMove: { from: Coord; to: Coord } | null;
  arrowGuides?: ArrowGuide[];
  labelMode: PieceLabelMode;
  showThreatRadar: boolean;
  onSquareClick: (r: number, c: number) => void;
}

/**
 * Helper to compute high-contrast, scalable piece typography
 */
const getPieceTypography = (
  type: PieceType,
  side: Side,
  mode: PieceLabelMode
): { label: string; fontSizeClass: string } => {
  const meta = PIECE_VALUES[type];
  const isRed = side === 'r';

  if (mode === 'hanzi') {
    return {
      label: isRed ? meta.hanRed : meta.hanBlack,
      fontSizeClass: 'text-[34px] font-serif font-black tracking-normal',
    };
  }

  if (mode === 'name') {
    const fullNames: Record<PieceType, { r: string; b: string }> = {
      K: { r: 'Tướng', b: 'Tướng' },
      A: { r: 'Sĩ', b: 'Sĩ' },
      E: { r: 'Tượng', b: 'Tượng' },
      R: { r: 'Xe', b: 'Xe' },
      C: { r: 'Pháo', b: 'Pháo' },
      H: { r: 'Mã', b: 'Mã' },
      P: { r: 'Tốt', b: 'Tốt' },
    };
    const name = fullNames[type][side];
    const fontSizeClass =
      name.length <= 2
        ? 'text-[22px] font-bold'
        : name.length <= 4
        ? 'text-[18px] font-bold tracking-tight'
        : 'text-[16px] font-bold tracking-tighter';
    return { label: name, fontSizeClass };
  }

  if (mode === 'dual') {
    return {
      label: meta.dualLabel,
      fontSizeClass: 'text-[18px] font-black tracking-tight',
    };
  }

  // Default 'vn': High-visibility Vietnamese Notation (X, M, P, T, S, Tg, B)
  const code = meta.codeVn;
  return {
    label: code,
    fontSizeClass: code.length > 1 ? 'text-[24px] font-black' : 'text-[28px] font-black',
  };
};

export const XiangqiBoard: React.FC<XiangqiBoardProps> = ({
  board,
  turn: _turn,
  selectedSquare,
  legalMoves,
  blockedInfos,
  lastMove,
  arrowGuides = [],
  labelMode,
  showThreatRadar,
  onSquareClick,
}) => {
  // Classical dimension: 70px cell spacing
  const cellSize = 70;
  const padX = 54;
  const padY = 50;
  const width = padX * 2 + 8 * cellSize; // 668
  const height = padY * 2 + 9 * cellSize; // 730

  const toX = (c: number) => padX + c * cellSize;
  const toY = (r: number) => padY + r * cellSize;

  const fiducials: Coord[] = [
    { r: 2, c: 1 },
    { r: 2, c: 7 },
    { r: 7, c: 1 },
    { r: 7, c: 7 },
    { r: 3, c: 0 },
    { r: 3, c: 2 },
    { r: 3, c: 4 },
    { r: 3, c: 6 },
    { r: 3, c: 8 },
    { r: 6, c: 0 },
    { r: 6, c: 2 },
    { r: 6, c: 4 },
    { r: 6, c: 6 },
    { r: 6, c: 8 },
  ];

  const redThreatened = showThreatRadar ? findThreatenedPieces(board, 'r') : [];
  const blackThreatened = showThreatRadar ? findThreatenedPieces(board, 'b') : [];
  const allThreatened = [...redThreatened, ...blackThreatened];

  const redKingInCheck = isKingInCheck(board, 'r') ? findKing(board, 'r') : null;
  const blackKingInCheck = isKingInCheck(board, 'b') ? findKing(board, 'b') : null;

  const renderFiducial = (r: number, c: number) => {
    const cx = toX(c);
    const cy = toY(r);
    const d = 5;
    const len = 9;
    const segments: string[] = [];

    if (c > 0) {
      segments.push(`M ${cx - d - len} ${cy - d} L ${cx - d} ${cy - d} L ${cx - d} ${cy - d - len}`);
      segments.push(`M ${cx - d - len} ${cy + d} L ${cx - d} ${cy + d} L ${cx - d} ${cy + d + len}`);
    }
    if (c < 8) {
      segments.push(`M ${cx + d + len} ${cy - d} L ${cx + d} ${cy - d} L ${cx + d} ${cy - d - len}`);
      segments.push(`M ${cx + d + len} ${cy + d} L ${cx + d} ${cy + d} L ${cx + d} ${cy + d + len}`);
    }

    return (
      <path
        key={`fid-${r}-${c}`}
        d={segments.join(' ')}
        stroke="#4a2c0f"
        strokeWidth="1.6"
        fill="none"
        opacity="0.85"
      />
    );
  };

  return (
    <div className="flex flex-col items-center select-none w-full">
      {/* Handcrafted Rosewood Inlay Board Frame */}
      <div className="board-outer-frame rounded-2xl p-2.5 sm:p-4 shadow-2xl w-full max-w-[660px] lg:max-w-[700px] flex items-center justify-center">
        <div className="wood-board-bg rounded-xl p-1.5 sm:p-2.5 w-full border border-[#4a2e12]/60">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full max-w-[620px] lg:max-w-[660px] h-auto drop-shadow-sm"
            role="img"
            aria-label="Bàn cờ tướng 9x10 chuẩn Việt Nam"
          >
            <defs>
              <marker
                id="arrow-gold"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#b3883b" />
              </marker>
              <marker
                id="arrow-hint"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#2d6a4f" />
              </marker>
            </defs>

            {/* Outer Board Frame */}
            <rect
              x={padX - 8}
              y={padY - 8}
              width={8 * cellSize + 16}
              height={9 * cellSize + 16}
              fill="none"
              stroke="#381d06"
              strokeWidth="3.2"
              rx="4"
            />

            {/* Top Coordinates (Black Side: 1 -> 9 left to right) - Crisp High Contrast */}
            {Array.from({ length: 9 }, (_, c) => (
              <text
                key={`coord-top-${c}`}
                x={toX(c)}
                y={26}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#1f1105] font-serif font-black text-[18px]"
              >
                {c + 1}
              </text>
            ))}

            {/* Bottom Coordinates (Red Side: 9 -> 1 left to right) - Rich Crimson Carmine */}
            {Array.from({ length: 9 }, (_, c) => (
              <text
                key={`coord-bot-${c}`}
                x={toX(c)}
                y={height - 20}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#991b1b] font-serif font-black text-[18px]"
              >
                {9 - c}
              </text>
            ))}

            {/* 10 Horizontal Rank Lines */}
            {Array.from({ length: 10 }, (_, r) => (
              <line
                key={`rank-${r}`}
                x1={toX(0)}
                y1={toY(r)}
                x2={toX(8)}
                y2={toY(r)}
                stroke="#4a2c0f"
                strokeWidth={r === 0 || r === 9 || r === 4 || r === 5 ? '2.2' : '1.4'}
              />
            ))}

            {/* 9 Vertical File Lines (Interrupted at the river for cols 1..7) */}
            {Array.from({ length: 9 }, (_, c) => {
              if (c === 0 || c === 8) {
                return (
                  <line
                    key={`file-full-${c}`}
                    x1={toX(c)}
                    y1={toY(0)}
                    x2={toX(c)}
                    y2={toY(9)}
                    stroke="#4a2c0f"
                    strokeWidth="2.2"
                  />
                );
              }
              return (
                <g key={`file-split-${c}`}>
                  <line
                    x1={toX(c)}
                    y1={toY(0)}
                    x2={toX(c)}
                    y2={toY(4)}
                    stroke="#4a2c0f"
                    strokeWidth="1.4"
                  />
                  <line
                    x1={toX(c)}
                    y1={toY(5)}
                    x2={toX(c)}
                    y2={toY(9)}
                    stroke="#4a2c0f"
                    strokeWidth="1.4"
                  />
                </g>
              );
            })}

            {/* Nine Palaces (Cửu Cung) Diagonals */}
            <line
              x1={toX(3)}
              y1={toY(0)}
              x2={toX(5)}
              y2={toY(2)}
              stroke="#543110"
              strokeWidth="1.6"
              strokeDasharray="5 3"
            />
            <line
              x1={toX(5)}
              y1={toY(0)}
              x2={toX(3)}
              y2={toY(2)}
              stroke="#543110"
              strokeWidth="1.6"
              strokeDasharray="5 3"
            />
            <line
              x1={toX(3)}
              y1={toY(7)}
              x2={toX(5)}
              y2={toY(9)}
              stroke="#543110"
              strokeWidth="1.6"
              strokeDasharray="5 3"
            />
            <line
              x1={toX(5)}
              y1={toY(7)}
              x2={toX(3)}
              y2={toY(9)}
              stroke="#543110"
              strokeWidth="1.6"
              strokeDasharray="5 3"
            />

            {/* River Inscriptions: Traditional Calligraphy */}
            <text
              x={toX(2)}
              y={(toY(4) + toY(5)) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-[#381a05] font-serif font-black text-[24px] tracking-[0.4em]"
            >
              SỞ HÀ
            </text>
            <text
              x={toX(6)}
              y={(toY(4) + toY(5)) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-[#381a05] font-serif font-black text-[24px] tracking-[0.4em]"
            >
              HÁN GIỚI
            </text>

            {/* Fiducials (Cross Marks) */}
            {fiducials.map((f) => renderFiducial(f.r, f.c))}

            {/* Last Move Indicator (Aged Gold Ring) */}
            {lastMove && (
              <g>
                <circle
                  cx={toX(lastMove.from.c)}
                  cy={toY(lastMove.from.r)}
                  r={9}
                  fill="rgba(179, 136, 59, 0.45)"
                />
                <circle
                  cx={toX(lastMove.to.c)}
                  cy={toY(lastMove.to.r)}
                  r={33}
                  fill="none"
                  stroke="#b3883b"
                  strokeWidth="2.8"
                />
              </g>
            )}

            {/* Selected Piece Highlight (Aged Brass Glow) */}
            {selectedSquare && (
              <circle
                cx={toX(selectedSquare.c)}
                cy={toY(selectedSquare.r)}
                r={34}
                fill="rgba(179, 136, 59, 0.18)"
                stroke="#c59b27"
                strokeWidth="3"
              />
            )}

            {/* Check Alert Ring (Deep Cinnabar) */}
            {[redKingInCheck, blackKingInCheck].map(
              (k, idx) =>
                k && (
                  <circle
                    key={`check-halo-${idx}`}
                    cx={toX(k.c)}
                    cy={toY(k.r)}
                    r={35}
                    fill="rgba(140, 34, 30, 0.25)"
                    stroke="#8c221e"
                    strokeWidth="3.2"
                  />
                )
            )}

            {/* Threat Radar */}
            {showThreatRadar &&
              allThreatened.map((item, idx) => {
                const isUnprotected = item.defenders.length === 0;
                return (
                  <circle
                    key={`threat-${idx}`}
                    cx={toX(item.coord.c)}
                    cy={toY(item.coord.r)}
                    r={33}
                    fill="none"
                    stroke={isUnprotected ? '#8c221e' : '#b3883b'}
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                );
              })}

            {/* Blocked Leg/Eye Indicators */}
            {blockedInfos.map((b, idx) => (
              <g key={`block-${idx}`}>
                <circle
                  cx={toX(b.blockerCoord.c)}
                  cy={toY(b.blockerCoord.r)}
                  r={31}
                  fill="none"
                  stroke="#8c221e"
                  strokeWidth="2.2"
                />
                <text
                  x={toX(b.intendedTo.c)}
                  y={toY(b.intendedTo.r)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-[#8c221e] font-black text-[15px]"
                >
                  ✕
                </text>
              </g>
            ))}

            {/* SVG Arrow Guides */}
            {arrowGuides.map((ag, idx) => {
              const x1 = toX(ag.from.c);
              const y1 = toY(ag.from.r);
              const x2 = toX(ag.to.c);
              const y2 = toY(ag.to.r);
              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.hypot(dx, dy) || 1;
              const targetX = x2 - (dx / dist) * 18;
              const targetY = y2 - (dy / dist) * 18;

              return (
                <line
                  key={`arrow-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={targetX}
                  y2={targetY}
                  stroke={ag.color === '#2563eb' ? '#2d6a4f' : '#b3883b'}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  markerEnd={
                    ag.color === '#2563eb' ? 'url(#arrow-hint)' : 'url(#arrow-gold)'
                  }
                  opacity="0.9"
                  className="pointer-events-none"
                />
              );
            })}

            {/* Handcrafted Physical Pieces */}
            {board.map((row, r) =>
              row.map((piece, c) => {
                if (!piece) return null;
                const cx = toX(c);
                const cy = toY(r);
                const isRed = piece.side === 'r';
                const { label, fontSizeClass } = getPieceTypography(
                  piece.type,
                  piece.side,
                  labelMode
                );

                return (
                  <g
                    key={`piece-${r}-${c}`}
                    onClick={() => onSquareClick(r, c)}
                    className="cursor-pointer piece-shadow"
                  >
                    {/* Outer Disc Body */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={30}
                      fill={isRed ? '#fffdf9' : '#1c1714'}
                      stroke={isRed ? '#8c221e' : '#d4cebe'}
                      strokeWidth="2.8"
                    />
                    {/* Inner Decorative Inscribed Groove */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={25}
                      fill="none"
                      stroke={isRed ? '#b83833' : '#73685c'}
                      strokeWidth="1.2"
                    />
                    {/* Engraved Typography */}
                    <text
                      x={cx}
                      y={cy}
                      dominantBaseline="central"
                      textAnchor="middle"
                      className={`font-black select-none ${fontSizeClass} ${
                        isRed ? 'fill-[#8c221e]' : 'fill-[#fcedc7]'
                      }`}
                    >
                      {label}
                    </text>
                  </g>
                );
              })
            )}

            {/* Legal Move Target Indicators (Subtle Jade Stones) */}
            {legalMoves.map((m, idx) => {
              const cx = toX(m.to.c);
              const cy = toY(m.to.r);
              const isCapture = Boolean(board[m.to.r][m.to.c]);
              return (
                <g
                  key={`legal-${idx}`}
                  onClick={() => onSquareClick(m.to.r, m.to.c)}
                  className="cursor-pointer"
                >
                  {isCapture ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={31}
                      fill="rgba(45, 106, 79, 0.25)"
                      stroke="#2d6a4f"
                      strokeWidth="3.2"
                    />
                  ) : (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="#2d6a4f"
                      stroke="#fcedc7"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            {/* Interactive Click Area */}
            {Array.from({ length: 10 }, (_, r) =>
              Array.from({ length: 9 }, (_, c) => (
                <circle
                  key={`hit-${r}-${c}`}
                  cx={toX(c)}
                  cy={toY(r)}
                  r={31}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onSquareClick(r, c)}
                />
              ))
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
