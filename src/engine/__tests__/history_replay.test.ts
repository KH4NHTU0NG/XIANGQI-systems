import { describe, it, expect } from 'vitest';
import {
  parseFEN,
  makeMoveOnBoard,
  formatVietnameseMove,
  BoardMatrix,
  Coord,
} from '../xiangqiEngine';

describe('Xiangqi Move History & Position Playback Engine', () => {
  it('correctly records, steps through, and reconstructs board states ply-by-ply', () => {
    const initialFen = '4k4/4a4/9/9/9/9/9/9/4R4/4K4 r - - 0 1';
    const { board: initBoard } = parseFEN(initialFen);

    const history: {
      ply: number;
      from: Coord;
      to: Coord;
      notation: string;
      boardSnapshot: BoardMatrix;
    }[] = [];

    // Move 1: Red Rook moves from (8,4) to (4,4) -> X5.4
    const m1From = { r: 8, c: 4 };
    const m1To = { r: 4, c: 4 };
    const p1 = initBoard[m1From.r][m1From.c]!;
    const not1 = formatVietnameseMove(m1From, m1To, p1);
    expect(not1).toBe('X5.4');

    const board1 = makeMoveOnBoard(initBoard, m1From, m1To);
    history.push({
      ply: 1,
      from: m1From,
      to: m1To,
      notation: not1,
      boardSnapshot: board1,
    });

    // Move 2: Black Advisor moves from (1,4) to (0,3) -> S5/6
    const m2From = { r: 1, c: 4 };
    const m2To = { r: 0, c: 3 };
    const p2 = board1[m2From.r][m2From.c]!;
    const not2 = formatVietnameseMove(m2From, m2To, p2);
    expect(not2).toBe('S5/4');

    const board2 = makeMoveOnBoard(board1, m2From, m2To);
    history.push({
      ply: 2,
      from: m2From,
      to: m2To,
      notation: not2,
      boardSnapshot: board2,
    });

    // Verify replay integrity
    expect(history.length).toBe(2);
    // At ply 1, Rook is at (4,4) and Advisor is still at (1,4)
    expect(history[0].boardSnapshot[4][4]?.type).toBe('R');
    expect(history[0].boardSnapshot[1][4]?.type).toBe('A');

    // At ply 2, Rook is at (4,4) and Advisor has moved to (0,3)
    expect(history[1].boardSnapshot[4][4]?.type).toBe('R');
    expect(history[1].boardSnapshot[0][3]?.type).toBe('A');
    expect(history[1].boardSnapshot[1][4]).toBeNull();
  });
});
