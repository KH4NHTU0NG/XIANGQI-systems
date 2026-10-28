import { describe, it, expect } from 'vitest';
import {
  parseFEN,
  getLegalMovesForSquare,
  makeMoveOnBoard,
  isKingInCheck,
  isCheckmateOrNoMoves,
  formatVietnameseMove,
  evaluateMoveCoach,
  boardToAscii,
} from '../xiangqiEngine';
import { MASTERY_LESSONS } from '../../data/masteryData';

describe('Xiangqi Mastery System - WXF Engine & Dataset Cross-Validation', () => {
  it('verifies all 26 lessons in MASTERY_LESSONS have valid FENs, legal moves, exact VN notations, and checkmate endings for puzzles', () => {
    expect(MASTERY_LESSONS.length).toBe(26);

    for (const lesson of MASTERY_LESSONS) {
      const { board: initBoard, turn } = parseFEN(lesson.initialFen);
      expect(turn).toBe('r');

      // Initial state: Black King must not be in check initially
      expect(
        isKingInCheck(initBoard, 'b'),
        `[${lesson.id}] Black must not be in check at initial state`
      ).toBe(false);

      let currentBoard = initBoard;

      for (let i = 0; i < lesson.steps.length; i++) {
        const step = lesson.steps[i];
        const { from, to, notation } = step.playerMove;
        const movingPiece = currentBoard[from.r][from.c];

        expect(
          movingPiece,
          `[${lesson.id} step ${i + 1}] Expected Red piece at (${from.r},${from.c})`
        ).not.toBeNull();
        expect(movingPiece?.side).toBe('r');

        // Verify move is strictly legal according to WXF engine
        const { moves: legalMoves } = getLegalMovesForSquare(
          currentBoard,
          from.r,
          from.c
        );
        const matchedLegal = legalMoves.find(
          (m) => m.to.r === to.r && m.to.c === to.c
        );
        expect(
          matchedLegal,
          `[${lesson.id} step ${i + 1}] Move (${from.r},${from.c})->(${to.r},${to.c}) (${notation}) is not legal! Legal moves: ${legalMoves
            .map((m) => m.vnNotation)
            .join(', ')}`
        ).toBeDefined();

        // Verify Vietnamese notation matches WXF formula
        const computedNotation = formatVietnameseMove(from, to, movingPiece!);
        expect(
          computedNotation,
          `[${lesson.id} step ${i + 1}] Notation mismatch`
        ).toBe(notation);

        // Apply Red move
        currentBoard = makeMoveOnBoard(currentBoard, from, to);

        // If opponentReply is present, verify it is strictly legal for Black
        if (step.opponentReply) {
          const {
            from: bFrom,
            to: bTo,
            notation: bNotation,
          } = step.opponentReply;
          const bPiece = currentBoard[bFrom.r][bFrom.c];
          expect(
            bPiece,
            `[${lesson.id} step ${i + 1} reply] Expected Black piece at (${bFrom.r},${bFrom.c})`
          ).not.toBeNull();
          expect(bPiece?.side).toBe('b');

          const { moves: bLegalMoves } = getLegalMovesForSquare(
            currentBoard,
            bFrom.r,
            bFrom.c
          );
          const matchedBlack = bLegalMoves.find(
            (m) => m.to.r === bTo.r && m.to.c === bTo.c
          );
          expect(
            matchedBlack,
            `[${lesson.id} step ${i + 1} reply] Black move (${bFrom.r},${bFrom.c})->(${bTo.r},${bTo.c}) (${bNotation}) is not legal! Legal moves: ${bLegalMoves
              .map((m) => m.vnNotation)
              .join(', ')}`
          ).toBeDefined();

          const computedBNotation = formatVietnameseMove(bFrom, bTo, bPiece!);
          expect(computedBNotation).toBe(bNotation);

          currentBoard = makeMoveOnBoard(currentBoard, bFrom, bTo);
        }
      }

      // Checkmate assertion for mate puzzles (Tier 1, Tier 2, T3-06, T4-03, T4-04)
      if (lesson.isMatePuzzle) {
        expect(
          isKingInCheck(currentBoard, 'b'),
          `[${lesson.id}] Final board should put Black King in check`
        ).toBe(true);
        expect(
          isCheckmateOrNoMoves(currentBoard, 'b'),
          `[${lesson.id}] Final board should leave Black with 0 legal moves (Checkmate)`
        ).toBe(true);
      }
    }
  });

  it('verifies special WXF mechanics: Horse leg block (Cản Mã), Elephant eye block (Chặn Mắt Tượng), and Move Coach classifications', () => {
    // Test T1-01 Horse leg block
    const { board: b1 } = parseFEN(
      '3ak4/4a4/3pN4/9/9/5R3/9/9/9/4K4 r - - 0 1'
    );
    const { moves: m1, blocks: blk1 } = getLegalMovesForSquare(b1, 2, 4);
    expect(blk1.some((b) => b.type === 'HORSE_LEG')).toBe(true);
    expect(m1.some((m) => m.vnNotation === 'M5.3')).toBe(true);

    // Test T1-02 Elephant eye block
    const { board: b2 } = parseFEN(
      '4k4/4a4/9/9/9/5R3/5P3/4B4/4C4/3KC4 r - - 0 1'
    );
    const { moves: m2, blocks: blk2 } = getLegalMovesForSquare(b2, 7, 4);
    expect(blk2.some((b) => b.type === 'ELEPHANT_EYE')).toBe(true);
    expect(m2.some((m) => m.vnNotation === 'T5.7')).toBe(true);

    // Test Move Coach Brilliant evaluation on checkmate move
    const mateMove = m1.find((m) => m.vnNotation === 'M5.3')!;
    const feedback = evaluateMoveCoach(b1, mateMove, 'M5.3');
    expect(feedback.quality).toBe('Brilliant');
    expect(feedback.badge).toBe('!!');

    // Test ASCII rendering
    const ascii = boardToAscii(b1);
    expect(ascii).toContain('SỞ HÀ');
    expect(ascii).toContain('HÁN GIỚI');
  });
});
