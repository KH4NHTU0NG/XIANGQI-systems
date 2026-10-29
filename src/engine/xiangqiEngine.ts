/**
 * XIANGQI MASTERY SYSTEM - CORE WXF ENGINE & MOVE COACH
 * Citations:
 * [1] World Xiangqi Federation (WXF) - World Xiangqi Rules & Numeric Notation: https://www.wxf.org
 * [2] Chess Programming Wiki - Chinese Chess Representation & Piece Evaluation: https://www.chessprogramming.org/Chinese_Chess
 */

export type Side = 'r' | 'b'; // 'r' = Red (Tiên / Đỏ), 'b' = Black (Hậu / Đen)
export type PieceType = 'K' | 'A' | 'E' | 'R' | 'C' | 'H' | 'P';

export interface Piece {
  type: PieceType;
  side: Side;
}

export type BoardMatrix = (Piece | null)[][]; // 10 rows (0..9) x 9 cols (0..8)

export interface Coord {
  r: number; // 0 (Black top rank) to 9 (Red bottom rank)
  c: number; // 0 (Left from Red's view: Red file 9 / Black file 1) to 8 (Right: Red file 1 / Black file 9)
}

export interface Move {
  from: Coord;
  to: Coord;
  piece: Piece;
  captured?: Piece | null;
  vnNotation: string;
}

export interface BlockedInfo {
  type: 'HORSE_LEG' | 'ELEPHANT_EYE' | 'PALACE_PIN' | 'FLYING_GENERAL';
  blockerCoord: Coord;
  intendedTo: Coord;
  description: string;
}

export type MoveQuality = 'Brilliant' | 'Best' | 'Inaccuracy' | 'Blunder';

export interface MoveCoachFeedback {
  quality: MoveQuality;
  labelVi: string;
  badge: string;
  scoreDelta: number;
  summary: string;
  whyExplanation: string;
  opponentCounter?: string;
  recommendedMove?: string;
}

export const INITIAL_FEN =
  'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR r - - 0 1';

/**
 * Standard piece values by phase (in centipawns / points scale)
 * Reference: WXF & Computer Xiangqi Heuristic Tables [2][5]
 */
export const PIECE_VALUES: Record<
  PieceType,
  {
    nameVi: string;
    codeVn: string;
    codeEn: string;
    dualLabel: string;
    hanRed: string;
    hanBlack: string;
    basePoints: number;
    endgamePoints: number;
    roleDesc: string;
  }
> = {
  K: {
    nameVi: 'Tướng (Soái)',
    codeVn: 'Tg',
    codeEn: 'K',
    dualLabel: 'K/Tg',
    hanRed: '帥',
    hanBlack: '將',
    basePoints: 1000,
    endgamePoints: 1000,
    roleDesc:
      'Đi từng ô một ngang hoặc dọc trong Cửu cung. "Mặt Tướng" kiểm soát toàn bộ cột dọc nếu không bị che (Trợ công bằng Lộ mặt Tướng).',
  },
  R: {
    nameVi: 'Xe (Xa)',
    codeVn: 'X',
    codeEn: 'R',
    dualLabel: 'R/X',
    hanRed: '車',
    hanBlack: '車',
    basePoints: 9.0,
    endgamePoints: 9.5,
    roleDesc:
      'Quân chủ lực mạnh nhất ("Nhất Xa sát vạn nhân"), đi ngang dọc không giới hạn khi không có quân cản.',
  },
  C: {
    nameVi: 'Pháo',
    codeVn: 'P',
    codeEn: 'C',
    dualLabel: 'C/P',
    hanRed: '炮',
    hanBlack: '砲',
    basePoints: 4.5,
    endgamePoints: 4.0,
    roleDesc:
      'Di chuyển như Xe nhưng khi ăn quân bắt buộc phải nhảy qua đúng 1 quân làm Ngòi (Pháo đầu mạnh ở khai/trung cuộc, giảm nhẹ sức mạnh ở tàn cuộc ít ngòi).',
  },
  H: {
    nameVi: 'Mã',
    codeVn: 'M',
    codeEn: 'H',
    dualLabel: 'H/M',
    hanRed: '馬',
    hanBlack: '馬',
    basePoints: 4.0,
    endgamePoints: 4.5,
    roleDesc:
      'Đi hình chữ Nhật (1 ngang/dọc + 1 chéo). Bị "Cản chân Mã" nếu ô sát cạnh theo hướng đi thẳng có quân đứng. Càng về cờ tàn ít quân cản, Mã càng mạnh hơn Pháo.',
  },
  E: {
    nameVi: 'Tượng (Tịnh)',
    codeVn: 'T',
    codeEn: 'E',
    dualLabel: 'E/T',
    hanRed: '相',
    hanBlack: '象',
    basePoints: 2.0,
    endgamePoints: 2.0,
    roleDesc:
      'Đi chéo 2 ô (hình chữ Điền), không được qua sông. Bị "Chặn mắt Tượng" nếu tâm hình chữ Điền có quân đứng.',
  },
  A: {
    nameVi: 'Sĩ',
    codeVn: 'S',
    codeEn: 'A',
    dualLabel: 'A/S',
    hanRed: '仕',
    hanBlack: '士',
    basePoints: 2.0,
    endgamePoints: 2.0,
    roleDesc:
      'Đi chéo từng ô một trong phạm vi Cửu cung (5 vị trí hợp lệ: 4 góc cung và 1 tâm cung). Lá chắn trực tiếp bảo vệ Tướng.',
  },
  P: {
    nameVi: 'Tốt (Binh)',
    codeVn: 'B',
    codeEn: 'P',
    dualLabel: 'P/B',
    hanRed: '兵',
    hanBlack: '卒',
    basePoints: 1.0,
    endgamePoints: 2.0,
    roleDesc:
      'Chưa qua sông chỉ đi thẳng 1 ô (1 điểm). Sau khi qua sông được đi ngang và tiến (tăng giá trị lên 2 điểm - "Tốt qua sông ngang với tiểu Xa"). Không bao giờ đi lùi.',
  },
};

/**
 * Convert FEN character to internal PieceType
 */
function charToPieceType(ch: string): PieceType | null {
  const upper = ch.toUpperCase();
  switch (upper) {
    case 'K':
      return 'K';
    case 'A':
      return 'A';
    case 'B':
    case 'E':
      return 'E';
    case 'N':
    case 'H':
      return 'H';
    case 'R':
      return 'R';
    case 'C':
      return 'C';
    case 'P':
      return 'P';
    default:
      return null;
  }
}

function pieceTypeToFenChar(piece: Piece): string {
  const map: Record<PieceType, string> = {
    K: 'K',
    A: 'A',
    E: 'B',
    H: 'N',
    R: 'R',
    C: 'C',
    P: 'P',
  };
  const ch = map[piece.type];
  return piece.side === 'r' ? ch : ch.toLowerCase();
}

/**
 * Parse a Xiangqi FEN string into a 10x9 BoardMatrix and active side
 */
export function parseFEN(fen: string): { board: BoardMatrix; turn: Side } {
  const parts = fen.trim().split(/\s+/);
  const rowsStr = parts[0].split('/');
  const turnRaw = (parts[1] || 'r').toLowerCase();
  const turn: Side = turnRaw === 'b' ? 'b' : 'r';

  const board: BoardMatrix = Array.from({ length: 10 }, () =>
    Array<Piece | null>(9).fill(null)
  );

  for (let r = 0; r < Math.min(10, rowsStr.length); r++) {
    let c = 0;
    for (const ch of rowsStr[r]) {
      if (c >= 9) break;
      if (ch >= '1' && ch <= '9') {
        c += parseInt(ch, 10);
      } else {
        const pType = charToPieceType(ch);
        if (pType) {
          const side: Side = ch === ch.toUpperCase() ? 'r' : 'b';
          board[r][c] = { type: pType, side };
        }
        c += 1;
      }
    }
  }

  return { board, turn };
}

/**
 * Serialize BoardMatrix and turn into standard Xiangqi FEN
 */
export function toFEN(board: BoardMatrix, turn: Side = 'r'): string {
  const rows: string[] = [];
  for (let r = 0; r < 10; r++) {
    let rowStr = '';
    let empty = 0;
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (!p) {
        empty++;
      } else {
        if (empty > 0) {
          rowStr += String(empty);
          empty = 0;
        }
        rowStr += pieceTypeToFenChar(p);
      }
    }
    if (empty > 0) rowStr += String(empty);
    rows.push(rowStr);
  }
  return `${rows.join('/')} ${turn} - - 0 1`;
}

/**
 * Deep clone board
 */
export function cloneBoard(board: BoardMatrix): BoardMatrix {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 10 && c >= 0 && c < 9;
}

export function inPalace(side: Side, r: number, c: number): boolean {
  if (c < 3 || c > 5) return false;
  return side === 'r' ? r >= 7 && r <= 9 : r >= 0 && r <= 2;
}

/**
 * Map column index (0..8) to Vietnamese File Number (1..9)
 * Red (Tiên): Right to Left -> col 8 is file 1, col 0 is file 9 (F_Red = 9 - c)
 * Black (Hậu): Left to Right -> col 0 is file 1, col 8 is file 9 (F_Black = c + 1)
 */
export function colToFileNumber(c: number, side: Side): number {
  return side === 'r' ? 9 - c : c + 1;
}

/**
 * Format a move into standard Vietnamese Xiangqi notation (e.g. P2-5, M8.7, X1/2)
 * Citation: WXF Numeric & Vietnamese Traditional Notation [1][2]
 */
export function formatVietnameseMove(
  from: Coord,
  to: Coord,
  piece: Piece
): string {
  const code = PIECE_VALUES[piece.type].codeVn;
  const startFile = colToFileNumber(from.c, piece.side);
  const endFile = colToFileNumber(to.c, piece.side);

  if (from.r === to.r) {
    // Horizontal movement: bình (-)
    return `${code}${startFile}-${endFile}`;
  }

  // Forward (tấn .) or Backward (thoái /)
  const isAdvance = piece.side === 'r' ? to.r < from.r : to.r > from.r;
  const actionSymbol = isAdvance ? '.' : '/';

  // Diagonal pieces (Horse M, Elephant T, Advisor S) use destination file
  if (piece.type === 'H' || piece.type === 'E' || piece.type === 'A') {
    return `${code}${startFile}${actionSymbol}${endFile}`;
  }

  // Linear pieces moving vertically (Rook X, Cannon P, Pawn B, King Tg) use step distance
  const stepCount = Math.abs(to.r - from.r);
  return `${code}${startFile}${actionSymbol}${stepCount}`;
}

/**
 * Generate pseudo-legal moves for a piece at (r, c) (before checking self-check/flying king)
 * Also collects blocked moves for educational visualization (Cản chân Mã, Chặn mắt Tượng)
 */
export function getPseudoMovesWithBlocks(
  board: BoardMatrix,
  r: number,
  c: number
): { targets: Coord[]; blocks: BlockedInfo[] } {
  const piece = board[r][c];
  if (!piece) return { targets: [], blocks: [] };

  const targets: Coord[] = [];
  const blocks: BlockedInfo[] = [];
  const { side, type } = piece;

  const canLand = (tr: number, tc: number) => {
    if (!inBounds(tr, tc)) return false;
    const occ = board[tr][tc];
    return !occ || occ.side !== side;
  };

  switch (type) {
    case 'K': {
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        const tr = r + dr;
        const tc = c + dc;
        if (inPalace(side, tr, tc) && canLand(tr, tc)) {
          targets.push({ r: tr, c: tc });
        }
      }
      break;
    }

    case 'A': {
      const dirs = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
      for (const [dr, dc] of dirs) {
        const tr = r + dr;
        const tc = c + dc;
        if (inPalace(side, tr, tc) && canLand(tr, tc)) {
          targets.push({ r: tr, c: tc });
        }
      }
      break;
    }

    case 'E': {
      const dirs = [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
      ];
      for (const [dr, dc] of dirs) {
        const tr = r + dr;
        const tc = c + dc;
        if (!inBounds(tr, tc)) continue;
        // Elephant cannot cross river
        if (side === 'r' && tr < 5) continue;
        if (side === 'b' && tr > 4) continue;

        const eyeR = r + dr / 2;
        const eyeC = c + dc / 2;
        if (board[eyeR][eyeC]) {
          blocks.push({
            type: 'ELEPHANT_EYE',
            blockerCoord: { r: eyeR, c: eyeC },
            intendedTo: { r: tr, c: tc },
            description: `Chặn mắt Tượng (Điền Tượng Nhãn) tại ô (${colToFileNumber(
              eyeC,
              side
            )}, hàng ${eyeR + 1}).`,
          });
          continue;
        }
        if (canLand(tr, tc)) {
          targets.push({ r: tr, c: tc });
        }
      }
      break;
    }

    case 'H': {
      const jumps: { leg: [number, number]; dests: [number, number][] }[] = [
        {
          leg: [-1, 0],
          dests: [
            [-2, -1],
            [-2, 1],
          ],
        },
        {
          leg: [1, 0],
          dests: [
            [2, -1],
            [2, 1],
          ],
        },
        {
          leg: [0, -1],
          dests: [
            [-1, -2],
            [1, -2],
          ],
        },
        {
          leg: [0, 1],
          dests: [
            [-1, 2],
            [1, 2],
          ],
        },
      ];
      for (const { leg, dests } of jumps) {
        const legR = r + leg[0];
        const legC = c + leg[1];
        if (!inBounds(legR, legC)) continue;
        if (board[legR][legC]) {
          for (const [dr, dc] of dests) {
            const tr = r + dr;
            const tc = c + dc;
            if (inBounds(tr, tc)) {
              blocks.push({
                type: 'HORSE_LEG',
                blockerCoord: { r: legR, c: legC },
                intendedTo: { r: tr, c: tc },
                description: `Cản chân Mã (Biệt Mã Cước) bởi quân tại lộ ${colToFileNumber(
                  legC,
                  side
                )}.`,
              });
            }
          }
          continue;
        }
        for (const [dr, dc] of dests) {
          const tr = r + dr;
          const tc = c + dc;
          if (canLand(tr, tc)) {
            targets.push({ r: tr, c: tc });
          }
        }
      }
      break;
    }

    case 'R': {
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        let tr = r + dr;
        let tc = c + dc;
        while (inBounds(tr, tc)) {
          const occ = board[tr][tc];
          if (!occ) {
            targets.push({ r: tr, c: tc });
          } else {
            if (occ.side !== side) {
              targets.push({ r: tr, c: tc });
            }
            break;
          }
          tr += dr;
          tc += dc;
        }
      }
      break;
    }

    case 'C': {
      const dirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of dirs) {
        let tr = r + dr;
        let tc = c + dc;
        let screenFound = false;
        while (inBounds(tr, tc)) {
          const occ = board[tr][tc];
          if (!screenFound) {
            if (!occ) {
              targets.push({ r: tr, c: tc });
            } else {
              screenFound = true;
            }
          } else {
            if (occ) {
              if (occ.side !== side) {
                targets.push({ r: tr, c: tc });
              }
              break;
            }
          }
          tr += dr;
          tc += dc;
        }
      }
      break;
    }

    case 'P': {
      const forward = side === 'r' ? -1 : 1;
      const tr = r + forward;
      if (canLand(tr, c)) {
        targets.push({ r: tr, c });
      }
      const crossedRiver = side === 'r' ? r <= 4 : r >= 5;
      if (crossedRiver) {
        if (canLand(r, c - 1)) targets.push({ r, c: c - 1 });
        if (canLand(r, c + 1)) targets.push({ r, c: c + 1 });
      }
      break;
    }
  }

  return { targets, blocks };
}

/**
 * Find King coordinates for a given side
 */
export function findKing(board: BoardMatrix, side: Side): Coord | null {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.side === side && p.type === 'K') {
        return { r, c };
      }
    }
  }
  return null;
}

/**
 * Check if the two Kings are directly facing each other on the same file with no pieces between (Flying General / Lộ mặt Tướng)
 */
export function areKingsFacing(board: BoardMatrix): boolean {
  const redK = findKing(board, 'r');
  const blackK = findKing(board, 'b');
  if (!redK || !blackK) return false;
  if (redK.c !== blackK.c) return false;

  const minR = Math.min(redK.r, blackK.r);
  const maxR = Math.max(redK.r, blackK.r);
  for (let r = minR + 1; r < maxR; r++) {
    if (board[r][redK.c] !== null) {
      return false;
    }
  }
  return true;
}

/**
 * Check whether `side`'s King is currently under attack (in Check) or Kings are facing
 */
export function isKingInCheck(board: BoardMatrix, side: Side): boolean {
  if (areKingsFacing(board)) return true;
  const kingCoord = findKing(board, side);
  if (!kingCoord) return true;

  const enemy: Side = side === 'r' ? 'b' : 'r';
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.side === enemy) {
        const { targets } = getPseudoMovesWithBlocks(board, r, c);
        if (targets.some((t) => t.r === kingCoord.r && t.c === kingCoord.c)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Apply a move on a cloned board and return the new board
 */
export function makeMoveOnBoard(
  board: BoardMatrix,
  from: Coord,
  to: Coord
): BoardMatrix {
  const next = cloneBoard(board);
  next[to.r][to.c] = next[from.r][from.c];
  next[from.r][from.c] = null;
  return next;
}

/**
 * Get all strictly legal moves for a piece at (r, c), plus educational block reasons (including Pin / Flying General)
 */
export function getLegalMovesForSquare(
  board: BoardMatrix,
  r: number,
  c: number
): { moves: Move[]; blocks: BlockedInfo[] } {
  const piece = board[r][c];
  if (!piece) return { moves: [], blocks: [] };

  const { targets, blocks } = getPseudoMovesWithBlocks(board, r, c);
  const legalMoves: Move[] = [];

  for (const to of targets) {
    const nextBoard = makeMoveOnBoard(board, { r, c }, to);
    const kingsFace = areKingsFacing(nextBoard);
    const inCheck = isKingInCheck(nextBoard, piece.side);

    if (!inCheck) {
      legalMoves.push({
        from: { r, c },
        to,
        piece,
        captured: board[to.r][to.c],
        vnNotation: formatVietnameseMove({ r, c }, to, piece),
      });
    } else {
      blocks.push({
        type: kingsFace ? 'FLYING_GENERAL' : 'PALACE_PIN',
        blockerCoord: { r, c },
        intendedTo: to,
        description: kingsFace
          ? 'Nước đi phạm luật "Lộ mặt Tướng" (Hai Tướng đối mặt trực tiếp trên cùng lộ dọc).'
          : 'Quân này đang bị ghim (Pin) hoặc chưa hóa giải nước chiếu Tướng!',
      });
    }
  }

  return { moves: legalMoves, blocks };
}

/**
 * Generate all legal moves for a side
 */
export function getAllLegalMoves(board: BoardMatrix, side: Side): Move[] {
  const all: Move[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.side === side) {
        const { moves } = getLegalMovesForSquare(board, r, c);
        all.push(...moves);
      }
    }
  }
  return all;
}

/**
 * Determine if `side` is checkmated or stalemated (in Xiangqi, stalemate is also a loss for the stalemated side per WXF Rule 13.1 [1])
 */
export function isCheckmateOrNoMoves(board: BoardMatrix, side: Side): boolean {
  return getAllLegalMoves(board, side).length === 0;
}

/**
 * Count how many enemy pieces are simultaneously giving check to `side`'s King (detects Lưỡng Chiếu / Double Check)
 */
export function countCheckingPieces(board: BoardMatrix, targetSide: Side): number {
  const kingCoord = findKing(board, targetSide);
  if (!kingCoord) return 0;
  const attackerSide: Side = targetSide === 'r' ? 'b' : 'r';
  let count = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p && p.side === attackerSide) {
        const { targets } = getPseudoMovesWithBlocks(board, r, c);
        if (targets.some((t) => t.r === kingCoord.r && t.c === kingCoord.c)) {
          count++;
        }
      }
    }
  }
  return count;
}

/**
 * Static board evaluation from Red's perspective (in points)
 */
export function evaluateBoard(board: BoardMatrix): number {
  if (isCheckmateOrNoMoves(board, 'b')) return 9999;
  if (isCheckmateOrNoMoves(board, 'r')) return -9999;

  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (!p) continue;
      let val = PIECE_VALUES[p.type].basePoints;
      // Positional bonuses
      if (p.type === 'P') {
        const crossed = p.side === 'r' ? r <= 4 : r >= 5;
        if (crossed) val = 2.0;
        if (c >= 3 && c <= 5 && crossed) val += 0.4; // Central passed pawn bonus
      } else if (p.type === 'C' && c === 4) {
        val += 0.35; // Central Cannon control
      } else if (p.type === 'H') {
        // Active horse bonus
        if (r >= 2 && r <= 7 && c >= 2 && c <= 6) val += 0.3;
      } else if (p.type === 'R') {
        // Open file / river rank bonus
        if (r === 4 || r === 5 || c === 3 || c === 5) val += 0.25;
      }

      score += p.side === 'r' ? val : -val;
    }
  }
  return Number(score.toFixed(2));
}

/**
 * Find squares where pieces of `side` are undefended ("Quân không căn" / Hanging pieces under attack)
 */
export function findThreatenedPieces(
  board: BoardMatrix,
  side: Side
): { coord: Coord; piece: Piece; attackers: Coord[]; defenders: Coord[] }[] {
  const results: {
    coord: Coord;
    piece: Piece;
    attackers: Coord[];
    defenders: Coord[];
  }[] = [];
  const enemy: Side = side === 'r' ? 'b' : 'r';

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const target = board[r][c];
      if (!target || target.side !== side || target.type === 'K') continue;

      const attackers: Coord[] = [];
      const defenders: Coord[] = [];

      for (let ar = 0; ar < 10; ar++) {
        for (let ac = 0; ac < 9; ac++) {
          const other = board[ar][ac];
          if (!other || (ar === r && ac === c)) continue;

          if (other.side === enemy) {
            const { targets } = getPseudoMovesWithBlocks(board, ar, ac);
            if (targets.some((t) => t.r === r && t.c === c)) {
              attackers.push({ r: ar, c: ac });
            }
          } else {
            // Check if friendly piece defends (r, c) by temporarily placing an enemy dummy there
            const temp = cloneBoard(board);
            temp[r][c] = { type: 'P', side: enemy };
            const { targets } = getPseudoMovesWithBlocks(temp, ar, ac);
            if (targets.some((t) => t.r === r && t.c === c)) {
              defenders.push({ r: ar, c: ac });
            }
          }
        }
      }

      if (attackers.length > 0) {
        results.push({ coord: { r, c }, piece: target, attackers, defenders });
      }
    }
  }

  return results;
}

/**
 * Minimax with Alpha-Beta pruning to find best move and evaluate Move Coach feedback
 */
export function findBestMove(
  board: BoardMatrix,
  side: Side,
  depth: number = 2
): { move: Move | null; score: number } {
  const legalMoves = getAllLegalMoves(board, side);
  if (legalMoves.length === 0) {
    return { move: null, score: side === 'r' ? -9999 : 9999 };
  }

  // Sort captures & checks first for better alpha-beta pruning
  legalMoves.sort((a, b) => {
    const capA = a.captured ? PIECE_VALUES[a.captured.type].basePoints : 0;
    const capB = b.captured ? PIECE_VALUES[b.captured.type].basePoints : 0;
    return capB - capA;
  });

  let bestMove: Move | null = legalMoves[0];
  let bestScore = side === 'r' ? -Infinity : Infinity;

  for (const m of legalMoves) {
    const nextBoard = makeMoveOnBoard(board, m.from, m.to);
    const enemy: Side = side === 'r' ? 'b' : 'r';
    const val = alphaBeta(
      nextBoard,
      depth - 1,
      -Infinity,
      Infinity,
      enemy === 'r'
    );
    if (side === 'r' && val > bestScore) {
      bestScore = val;
      bestMove = m;
    } else if (side === 'b' && val < bestScore) {
      bestScore = val;
      bestMove = m;
    }
  }

  return { move: bestMove, score: bestScore };
}

function alphaBeta(
  board: BoardMatrix,
  depth: number,
  alpha: number,
  beta: number,
  maximizingRed: boolean
): number {
  const side: Side = maximizingRed ? 'r' : 'b';
  const moves = getAllLegalMoves(board, side);
  if (moves.length === 0) {
    return maximizingRed ? -9999 - depth : 9999 + depth;
  }
  if (depth <= 0) {
    return evaluateBoard(board);
  }

  if (maximizingRed) {
    let value = -Infinity;
    for (const m of moves) {
      const next = makeMoveOnBoard(board, m.from, m.to);
      value = Math.max(value, alphaBeta(next, depth - 1, alpha, beta, false));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const m of moves) {
      const next = makeMoveOnBoard(board, m.from, m.to);
      value = Math.min(value, alphaBeta(next, depth - 1, alpha, beta, true));
      beta = Math.min(beta, value);
      if (beta <= alpha) break;
    }
    return value;
  }
}

/**
 * Evaluate a user's move and return structured Move Coach classification + Vietnamese "Tại sao?" explanation
 */
export function evaluateMoveCoach(
  boardBefore: BoardMatrix,
  move: Move,
  expectedNotation?: string,
  expectedWhy?: string
): MoveCoachFeedback {
  const side = move.piece.side;
  const enemy: Side = side === 'r' ? 'b' : 'r';
  const boardAfter = makeMoveOnBoard(boardBefore, move.from, move.to);

  const givesCheck = isKingInCheck(boardAfter, enemy);
  const checkCount = countCheckingPieces(boardAfter, enemy);
  const deliversMate = isCheckmateOrNoMoves(boardAfter, enemy);
  const isExpected =
    expectedNotation &&
    move.vnNotation.toUpperCase() === expectedNotation.toUpperCase();

  // Check if the moved piece or another major piece is now hanging
  const threatenedAfter = findThreatenedPieces(boardAfter, side);
  const majorHanging = threatenedAfter.find(
    (t) =>
      (t.piece.type === 'R' || t.piece.type === 'C' || t.piece.type === 'H') &&
      t.defenders.length === 0
  );

  // Check if it was a sacrifice that forces check or mate
  const wasSacrifice =
    givesCheck &&
    threatenedAfter.some(
      (t) =>
        t.coord.r === move.to.r &&
        t.coord.c === move.to.c &&
        t.attackers.length > 0
    );

  // Engine best move comparison
  const { move: engineBest, score: bestScore } = findBestMove(
    boardBefore,
    side,
    2
  );
  const afterReply = findBestMove(boardAfter, enemy, 1);
  const actualScore = afterReply.score;
  const scoreDiff =
    side === 'r' ? actualScore - bestScore : bestScore - actualScore;

  // 1. Check for Brilliant Move (!!): Sacrifice with check/mate or Double Check or Puzzle Mate
  if (
    (isExpected && (wasSacrifice || checkCount >= 2 || deliversMate)) ||
    deliversMate ||
    checkCount >= 2
  ) {
    return {
      quality: 'Brilliant',
      labelVi: 'Nước Tuyệt Diệu (Brilliant)',
      badge: '!!',
      scoreDelta: +3.5,
      summary: deliversMate
        ? `Tuyệt sát! Nước ${move.vnNotation} khóa chặt toàn bộ Cửu cung đối phương.`
        : checkCount >= 2
        ? `Lưỡng chiếu (${move.vnNotation})! Hai quân cùng chiếu buộc Tướng đối phương phải di chuyển.`
        : `Đòn phế quân tranh tiên sắc bén (${move.vnNotation}) phá toang phòng tuyến Cửu cung!`,
      whyExplanation:
        expectedWhy ||
        (deliversMate
          ? `Nước ${move.vnNotation} phối hợp hoàn hảo giữa các quân tấn công và mặt Tướng/ngòi Pháo, khiến Tướng đối phương không còn bất kỳ ô thoát hợp lệ nào.`
          : `Nước ${move.vnNotation} tạo ra đòn tấn công cưỡng bức (Forcing Move), tước quyền phòng thủ thụ động của đối phương.`),
      opponentCounter: deliversMate
        ? 'Đối phương đã hết nước đi hợp lệ (Tuyệt sát).'
        : afterReply.move
        ? `Đối phương buộc phải đỡ bằng ${afterReply.move.vnNotation}.`
        : undefined,
      recommendedMove: move.vnNotation,
    };
  }

  // 2. Check for Best Move (★)
  if (isExpected || (!majorHanging && scoreDiff >= -0.6)) {
    return {
      quality: 'Best',
      labelVi: 'Nước Chuẩn (Best)',
      badge: '★',
      scoreDelta: 0,
      summary: `Nước đi chuẩn xác (${move.vnNotation}), giữ vững quyền Tiên thủ và cấu trúc đội hình.`,
      whyExplanation:
        expectedWhy ||
        `Nước ${move.vnNotation} phát triển quân đúng nguyên lý "Xuất quân nhanh - Chiếm lộ sườn - Giữ trung lộ", không để lộ điểm yếu trong trận hình.`,
      opponentCounter: afterReply.move
        ? `Đối phương có thể đối ứng bằng ${afterReply.move.vnNotation}.`
        : undefined,
      recommendedMove: move.vnNotation,
    };
  }

  // 3. Check for Blunder (??)
  if (majorHanging || scoreDiff <= -2.5 || (expectedNotation && !givesCheck)) {
    const hungName = majorHanging
      ? PIECE_VALUES[majorHanging.piece.type].nameVi
      : 'thế công chủ động';
    return {
      quality: 'Blunder',
      labelVi: 'Nước Sai Lầm Mất Quân (Blunder)',
      badge: '??',
      scoreDelta: Number(scoreDiff.toFixed(1)),
      summary: majorHanging
        ? `Cẩn thận! Nước ${move.vnNotation} làm ${hungName} rơi vào miệng địch mà không có quân bảo vệ (mất căn).`
        : `Nước ${move.vnNotation} đánh mất nhịp chiếu/tấn công quyết định và trao quyền Tiên thủ cho đối phương!`,
      whyExplanation: majorHanging
        ? `Sau khi đi ${move.vnNotation}, quân ${hungName} tại lộ ${colToFileNumber(
            majorHanging.coord.c,
            side
          )} bị đối phương ăn trắng mà không có quân giữ căn (Root). Trong cờ thế hoặc sát cuộc, bỏ lỡ nhịp chiếu sẽ bị đối phương phản sát ngay.`
        : expectedWhy
        ? `Nước tối ưu trong hình cờ này phải là ${expectedNotation}: ${expectedWhy}`
        : `Nước ${move.vnNotation} làm suy yếu tuyến phòng thủ và bỏ lỡ cơ hội gây sức ép trực diện.`,
      opponentCounter: afterReply.move
        ? `Đòn trừng phạt của đối phương: ${afterReply.move.vnNotation}.`
        : undefined,
      recommendedMove:
        expectedNotation || engineBest?.vnNotation || move.vnNotation,
    };
  }

  // 4. Otherwise Inaccuracy (?!)
  return {
    quality: 'Inaccuracy',
    labelVi: 'Nước Yếu (Inaccuracy)',
    badge: '?!',
    scoreDelta: Number(scoreDiff.toFixed(1)),
    summary: `Nước ${move.vnNotation} hơi chậm nhịp, chưa khai thác triệt để điểm yếu của đối phương.`,
    whyExplanation: expectedWhy
      ? `Nước chuẩn hơn là ${expectedNotation}. Lý do: ${expectedWhy}`
      : `Nước ${move.vnNotation} làm giảm độ linh hoạt của quân chủ lực hoặc làm tắc mắt Tượng / chân Mã trung lộ, khiến bạn mất quyền Tiên thủ.`,
    opponentCounter: afterReply.move
      ? `Đối phương dễ dàng hóa giải bằng ${afterReply.move.vnNotation}.`
      : undefined,
    recommendedMove:
      expectedNotation || engineBest?.vnNotation || move.vnNotation,
  };
}

/**
 * Render an intuitive ASCII/Text Xiangqi board with Vietnamese coordinates (Required for Prompt B 1-on-1 Grandmaster Mode)
 */
export function boardToAscii(board: BoardMatrix): string {
  const lines: string[] = [];
  lines.push('   [HẬU / ĐEN: Lộ 1 ───────────► Lộ 9]');
  lines.push('     1   2   3   4   5   6   7   8   9');
  lines.push('   ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐');

  for (let r = 0; r < 10; r++) {
    const rowCells: string[] = [];
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (!p) {
        if ((r === 1 || r === 8) && c === 4) {
          rowCells.push(' ┼ ');
        } else {
          rowCells.push(' · ');
        }
      } else {
        const code = PIECE_VALUES[p.type].codeVn;
        // Uppercase for Red, lowercase for Black
        const formatted =
          p.side === 'r' ? code.toUpperCase() : code.toLowerCase();
        rowCells.push(
          formatted.length === 2 ? `${formatted} ` : ` ${formatted} `
        );
      }
    }
    lines.push(`H${r + 1 < 10 ? ' ' + (r + 1) : r + 1}│${rowCells.join('│')}│`);
    if (r === 4) {
      lines.push('   ├───┴───┴───┴───┴───┴───┴───┴───┴───┤');
      lines.push('   │          SỞ HÀ  ───  HÁN GIỚI   │');
      lines.push('   ├───┬───┬───┬───┬───┬───┬───┬───┬───┤');
    } else if (r < 9) {
      lines.push('   ├───┼───┼───┼───┼───┼───┼───┼───┼───┤');
    }
  }

  lines.push('   └───┴───┴───┴───┴───┴───┴───┴───┴───┘');
  lines.push('     9   8   7   6   5   4   3   2   1');
  lines.push('   [TIÊN / ĐỎ: Lộ 9 ◄─────────── Lộ 1]');
  return lines.join('\n');
}

