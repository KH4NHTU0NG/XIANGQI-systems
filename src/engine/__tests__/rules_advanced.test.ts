import { describe, it, expect } from 'vitest';
import {
  parseFEN,
  toFEN,
  getLegalMovesForSquare,
  findThreatenedPieces,
  INITIAL_FEN,
} from '../xiangqiEngine';

describe('Advanced WXF Rules & Comprehensive Engine Diagnostics', () => {
  it('strictly enforces King and Advisor movement inside the Nine Palaces only', () => {
    // Red King at (9,4). Black King at (0,5) with Advisors blocking files so Flying General doesn't restrict palace steps
    const { board } = parseFEN('4ak3/5a3/9/9/9/9/9/9/9/4K4 r - - 0 1');
    const { moves: kingMoves } = getLegalMovesForSquare(board, 9, 4);

    expect(kingMoves.length).toBe(3); // (8,4), (9,3), (9,5)
    for (const m of kingMoves) {
      expect(m.to.r).toBeGreaterThanOrEqual(7);
      expect(m.to.r).toBeLessThanOrEqual(9);
      expect(m.to.c).toBeGreaterThanOrEqual(3);
      expect(m.to.c).toBeLessThanOrEqual(5);
    }

    // Black Advisor at corner of palace (0,3) can only move diagonally to center (1,4)
    const { board: bAdv } = parseFEN('3a4k/9/9/9/9/9/9/9/9/5K3 b - - 0 1');
    const { moves: advMoves } = getLegalMovesForSquare(bAdv, 0, 3);
    expect(advMoves.length).toBe(1);
    expect(advMoves[0].to).toEqual({ r: 1, c: 4 });
  });

  it('strictly enforces Flying General rule (Mặt Tướng không được đối diện)', () => {
    // Red King at (9,4), Black King at (0,4). Red Rook at (5,4) blocks line of sight.
    // If Red Rook tries to move away from file 4, it exposes Kings facing each other -> Illegal!
    const { board } = parseFEN('4k4/9/9/9/9/4R4/9/9/9/4K4 r - - 0 1');
    const { moves: rookMoves } = getLegalMovesForSquare(board, 5, 4);

    // Rook can only move along column 4 (r from 1 to 8, except 5)
    for (const m of rookMoves) {
      expect(m.to.c, 'Rook moving off column 4 would expose Kings!').toBe(4);
    }

    // Kings on same file: King cannot move into directly facing position
    const openBoard = parseFEN('4k4/9/9/9/9/9/9/9/9/4K4 r - - 0 1').board;
    const { moves: openKingMoves } = getLegalMovesForSquare(openBoard, 9, 4);
    // King can move left to (9,3) or right to (9,5). Cannot step forward to (8,4) because facing Black King!
    for (const m of openKingMoves) {
      expect(m.to.c).not.toBe(4);
    }
  });

  it('strictly validates Horse leg blocking (Cản chân Mã) in all 8 directions', () => {
    // Kings on different files (Black King at 0,3; Red King at 9,5) so Horse at (4,4) is not pinned by Flying General
    const emptyBoard = parseFEN('3k5/9/9/9/4N4/9/9/9/9/5K3 r - - 0 1').board;
    const { moves: freeMoves } = getLegalMovesForSquare(emptyBoard, 4, 4);
    expect(freeMoves.length).toBe(8);

    // Block upper leg (3,4) with Black Pawn: should disable (2,3) and (2,5)
    const blockedUpBoard = parseFEN('3k5/9/9/4p4/4N4/9/9/9/9/5K3 r - - 0 1').board;
    const { moves: blockedUpMoves, blocks } = getLegalMovesForSquare(blockedUpBoard, 4, 4);
    expect(blockedUpMoves.length).toBe(6);
    expect(blockedUpMoves.some(m => m.to.r === 2)).toBe(false);
    expect(blocks.some(b => b.blockerCoord.r === 3 && b.blockerCoord.c === 4)).toBe(true);

    // Block all 4 legs: Horse has 0 moves
    const fullyBlocked = parseFEN('3k5/9/9/4p4/3pNp3/4p4/9/9/9/5K3 r - - 0 1').board;
    const { moves: noMoves } = getLegalMovesForSquare(fullyBlocked, 4, 4);
    expect(noMoves.length).toBe(0);
  });

  it('strictly validates Elephant eye blocking (Chặn mắt Tượng) and river boundary', () => {
    // Kings on different files: Black King at (0,3), Red King at (9,5).
    // Red Elephant at (9,2). Can jump to (7,0) and (7,4).
    const freeEle = parseFEN('3k5/9/9/9/9/9/9/9/9/2B2K3 r - - 0 1').board;
    const { moves: eleMoves } = getLegalMovesForSquare(freeEle, 9, 2);
    expect(eleMoves.length).toBe(2);

    // Block eye at (8,3) with Red Soldier: can only jump to (7,0)
    const blockedEle = parseFEN('3k5/9/9/9/9/9/9/9/3P5/2B2K3 r - - 0 1').board;
    const { moves: oneMoves, blocks } = getLegalMovesForSquare(blockedEle, 9, 2);
    expect(oneMoves.length).toBe(1);
    expect(oneMoves[0].to).toEqual({ r: 7, c: 0 });
    expect(blocks.some(b => b.type === 'ELEPHANT_EYE')).toBe(true);

    // Elephant can NEVER cross the river (rows 0-4 for Red)
    for (const m of eleMoves) {
      expect(m.to.r).toBeGreaterThanOrEqual(5);
    }
  });

  it('strictly validates Soldier/Pawn crossing the river mechanics', () => {
    // Kings on different files: Black King at (0,3), Red King at (9,5)
    // Red Pawn before crossing river at (6,4): can ONLY advance forward to (5,4)
    const preRiver = parseFEN('3k5/9/9/9/9/9/4P4/9/9/5K3 r - - 0 1').board;
    const { moves: preMoves } = getLegalMovesForSquare(preRiver, 6, 4);
    expect(preMoves.length).toBe(1);
    expect(preMoves[0].to).toEqual({ r: 5, c: 4 });

    // Red Pawn across the river at (4,4): can advance forward (3,4), left (4,3), or right (4,5) - NEVER backwards!
    const postRiver = parseFEN('3k5/9/9/9/4P4/9/9/9/9/5K3 r - - 0 1').board;
    const { moves: postMoves } = getLegalMovesForSquare(postRiver, 4, 4);
    expect(postMoves.length).toBe(3);
    for (const m of postMoves) {
      expect(m.to.r).toBeLessThanOrEqual(4); // No backward move (row 5)
    }
  });

  it('guarantees exact roundtrip FEN serialization and deserialization', () => {
    const fensToTest = [
      INITIAL_FEN,
      'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR r - - 0 1',
      '4rk3/3P5/4bP3/9/9/8P/9/1p2p2C1/3p1p3/4K1RR1 r - - 0 1',
      '4k1P2/4a4/4R4/9/9/9/9/9/9/4K4 r - - 0 1',
    ];

    for (const fen of fensToTest) {
      const { board, turn } = parseFEN(fen);
      const serialized = toFEN(board, turn);
      expect(serialized).toBe(fen);
    }
  });

  it('accurately distinguishes protected pieces from unprotected pieces in Threat Radar', () => {
    // Red Chariot at (5,4) attacked by Black Cannon at (5,0) with ngòi at (5,2).
    // Red Chariot is defended by Red Horse at (7,5).
    const board = parseFEN('4k4/9/9/9/9/c1c1R4/9/5N3/9/4K4 b - - 0 1').board;
    const redThreatened = findThreatenedPieces(board, 'r');

    expect(redThreatened.length).toBeGreaterThanOrEqual(1);
    const chariotThreat = redThreatened.find(t => t.coord.r === 5 && t.coord.c === 4);
    expect(chariotThreat).toBeDefined();
    expect(chariotThreat?.attackers.length).toBeGreaterThanOrEqual(1);
    expect(chariotThreat?.defenders.length).toBeGreaterThanOrEqual(1);
  });
});
