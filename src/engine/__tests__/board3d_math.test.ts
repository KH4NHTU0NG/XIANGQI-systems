import { describe, it, expect } from 'vitest';
import {
  gridToWorld3D,
  worldToGrid3D,
  computeParabolicPoint,
} from '../../components/XiangqiBoard3D';

describe('3D Spatial Coordinate Mapping & Parabolic Bézier Trajectory', () => {
  it('accurately maps all 90 intersections (10x9) bijectively between grid (r, c) and 3D world (X, Z)', () => {
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const world = gridToWorld3D(r, c);
        const recovered = worldToGrid3D(world.x, world.z);
        expect(recovered).not.toBeNull();
        expect(recovered?.r).toBe(r);
        expect(recovered?.c).toBe(c);
      }
    }
  });

  it('places the center file 5 (c = 4) at X = 0 and river center (r = 4.5) symmetrically around Z = 0', () => {
    const blackPalaceCenter = gridToWorld3D(1, 4);
    const redPalaceCenter = gridToWorld3D(8, 4);

    expect(blackPalaceCenter.x).toBeCloseTo(0, 5);
    expect(redPalaceCenter.x).toBeCloseTo(0, 5);
    expect(blackPalaceCenter.z).toBeCloseTo(-redPalaceCenter.z, 5);
  });

  it('rejects out-of-bounds 3D world coordinates beyond the 9x10 board perimeter', () => {
    expect(worldToGrid3D(-10, 0)).toBeNull();
    expect(worldToGrid3D(10, 0)).toBeNull();
    expect(worldToGrid3D(0, -12)).toBeNull();
    expect(worldToGrid3D(0, 12)).toBeNull();
  });

  it('computes exact Quadratic Bézier parabolic trajectory apex at t = 0.5 and endpoints at t = 0, 1', () => {
    const start = { x: -2.04, z: 3.57 };
    const end = { x: 1.02, z: -1.53 };
    const baseY = 0.115;
    const peakHeight = 1.35;

    const p0 = computeParabolicPoint(start, end, baseY, peakHeight, 0);
    expect(p0.x).toBeCloseTo(start.x, 5);
    expect(p0.z).toBeCloseTo(start.z, 5);
    expect(p0.y).toBeCloseTo(baseY, 5);

    const pMid = computeParabolicPoint(start, end, baseY, peakHeight, 0.5);
    expect(pMid.x).toBeCloseTo((start.x + end.x) / 2, 5);
    expect(pMid.z).toBeCloseTo((start.z + end.z) / 2, 5);
    expect(pMid.y).toBeCloseTo(baseY + peakHeight, 5);

    const p1 = computeParabolicPoint(start, end, baseY, peakHeight, 1);
    expect(p1.x).toBeCloseTo(end.x, 5);
    expect(p1.z).toBeCloseTo(end.z, 5);
    expect(p1.y).toBeCloseTo(baseY, 5);
  });
});

