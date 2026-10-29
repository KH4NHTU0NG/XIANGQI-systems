import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseFEN } from '../xiangqiEngine';

describe('Xiangqi 3D Masterpiece & Mastery Roadmap Integration', () => {
  const htmlPath = path.resolve(__dirname, '../../../public/xiangqi-3d.html');
  const desktopPath = '/Users/trankhanhtuong/Desktop/xiangqi-3d-masterpiece.html';

  it('contains the complete standalone 3D file with inlined mastery data', () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
    const content = fs.readFileSync(htmlPath, 'utf8');

    // UI elements
    expect(content).toContain('id="seal-mastery"');
    expect(content).toContain('id="btn-top-mastery"');
    expect(content).toContain('id="mastery-drawer"');
    expect(content).toContain('id="lesson-card"');
    expect(content).toContain('id="lesson-victory-banner"');
    expect(content).toContain('XIANGQI_MASTERY_DATA');

    // 4 Tiers
    expect(content).toContain('Tầng 1');
    expect(content).toContain('Tầng 2');
    expect(content).toContain('Tầng 3');
    expect(content).toContain('Tầng 4');
  });

  it('validates that all 26 lesson FENs in masteryData.json are well-formed', () => {
    const jsonPath = path.resolve(__dirname, '../../../public/masteryData.json');
    expect(fs.existsSync(jsonPath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    expect(data.tiers).toHaveLength(4);
    expect(data.lessons).toHaveLength(26);

    data.lessons.forEach((lesson: { id: string; initialFen: string; title: string }) => {
      const parsed = parseFEN(lesson.initialFen);
      expect(parsed.board).toHaveLength(10);
      expect(parsed.board[0]).toHaveLength(9);
      expect(['r', 'b']).toContain(parsed.turn);
    });
  });

  it('verifies Desktop standalone file is synchronized', () => {
    expect(fs.existsSync(desktopPath)).toBe(true);
    const desktopContent = fs.readFileSync(desktopPath, 'utf8');
    expect(desktopContent).toContain('id="seal-mastery"');
    expect(desktopContent).toContain('id="mastery-drawer"');
  });
});
