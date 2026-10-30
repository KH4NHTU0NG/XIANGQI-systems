import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';
import {
  BAGUA_VERTEX_SHADER,
  BAGUA_FRAGMENT_SHADER,
  SHOCKWAVE_GODRAYS_FRAGMENT_SHADER,
} from '../shaders/xianxiaShaders';
import {
  BoardMatrix,
  Coord,
  Move,
  BlockedInfo,
  PIECE_VALUES,
  Side,
  PieceType,
  isKingInCheck,
  findKing,
  evaluateBoard,
  getPseudoMovesWithBlocks,
} from '../engine/xiangqiEngine';
import { PieceLabelMode, ArrowGuide } from './XiangqiBoard';

export type Board3DTheme = 'shanshui' | 'ebony' | 'jade' | 'cyber';
export type Camera3DMode = '45' | 'top' | 'free';
export type PieceVisualMode = 'living' | 'disc';

interface XiangqiBoard3DProps {
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

const CELL_SIZE = 1.02;
const PIECE_RADIUS = 0.42;
const PIECE_HEIGHT = 0.23;
const BOARD_TOP_Y = 0;

// Shared GLTFLoader with MeshoptDecoder for Tripo PBR Meshopt GLB models
const sharedGltfLoader = new GLTFLoader();
sharedGltfLoader.setMeshoptDecoder(MeshoptDecoder);
const sharedGltfCache = new Map<PieceType, THREE.Group>();
const sharedGltfPromises = new Map<PieceType, Promise<THREE.Group>>();

function normalizeChariotGLTF(gltfScene: THREE.Group): THREE.Group {
  gltfScene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(gltfScene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const targetScale = 0.86 / maxDim;

  const wrapper = new THREE.Group();
  gltfScene.scale.setScalar(targetScale);
  gltfScene.position.set(
    -center.x * targetScale,
    -box.min.y * targetScale,
    -center.z * targetScale
  );

  gltfScene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      if (mesh.geometry) {
        mesh.geometry.computeVertexNormals();
      }
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      mesh.userData.outlineParameters = { visible: false };
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        if (!m) return;
        m.userData = m.userData || {};
        m.userData.outlineParameters = { visible: false };
      });
    }
  });

  wrapper.add(gltfScene);
  return wrapper;
}

function instantiateChariotForSide(
  normalizedWrapper: THREE.Group,
  isRed: boolean,
  woodMat: THREE.Material,
  bannerMat: THREE.Material
): THREE.Group {
  const instance = normalizedWrapper.clone(true);
  instance.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      mesh.userData.outlineParameters = { visible: false };
      const origMat = mesh.material as THREE.MeshStandardMaterial;
      if (origMat && !Array.isArray(origMat)) {
        origMat.userData = origMat.userData || {};
        origMat.userData.outlineParameters = { visible: false };
        const matKey = isRed ? '__redBrightToonMat' : '__blueBrightToonMat';
        if (!origMat.userData[matKey]) {
          const baseMap = origMat.map || null;
          const normalMap = origMat.normalMap || null;
          if (baseMap) {
            baseMap.colorSpace = THREE.SRGBColorSpace;
            baseMap.needsUpdate = true;
          }
          const brightMat = new THREE.MeshToonMaterial({
            map: baseMap,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.85, 0.85),
            color: isRed
              ? new THREE.Color(2.2, 1.85, 1.65)
              : new THREE.Color(1.65, 1.95, 2.25),
            emissiveMap: baseMap,
            emissive: isRed
              ? new THREE.Color(0xffb396)
              : new THREE.Color(0x96dcff),
            emissiveIntensity: 0.72,
          });
          brightMat.userData = { outlineParameters: { visible: false } };
          origMat.userData[matKey] = brightMat;
        }
        mesh.material = origMat.userData[matKey];
      }
    }
  });

  [-0.24, 0.24].forEach((bx) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.8, 8), woodMat);
    pole.position.set(bx, 0.4, -0.3);
    instance.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.25), bannerMat);
    flag.position.set(bx, 0.65, -0.22);
    instance.add(flag);
  });

  return instance;
}

function loadChariotGLTFOnce(): Promise<THREE.Group> {
  if (sharedGltfCache.has('R')) {
    return Promise.resolve(sharedGltfCache.get('R')!);
  }
  if (sharedGltfPromises.has('R')) {
    return sharedGltfPromises.get('R')!;
  }
  const p = new Promise<THREE.Group>((resolve, reject) => {
    sharedGltfLoader.load(
      '/models/xe_chariot.glb',
      (gltf) => {
        const normalized = normalizeChariotGLTF(gltf.scene);
        sharedGltfCache.set('R', normalized);
        resolve(normalized);
      },
      undefined,
      reject
    );
  });
  sharedGltfPromises.set('R', p);
  return p;
}

const THEME_CONFIG: Record<
  Board3DTheme,
  {
    name: string;
    bg1: string;
    bg2: string;
    frameHex: number;
    gridStroke: string;
    riverColor: string;
    redBodyHex: number;
    blackBodyHex: number;
    mistHex: number;
  }
> = {
  shanshui: {
    name: '🏔️ Thủy Mặc Tiên Hiệp 4K',
    bg1: '#edd09c',
    bg2: '#c88d48',
    frameHex: 0x5c3010,
    gridStroke: '#180f08',
    riverColor: '#1f1106',
    redBodyHex: 0xdc2626,
    blackBodyHex: 0x0284c7,
    mistHex: 0xf472b6,
  },
  ebony: {
    name: '🏮 Hoàng Gia Gỗ Mun',
    bg1: '#261409',
    bg2: '#130a04',
    frameHex: 0x1c0f07,
    gridStroke: '#eab308',
    riverColor: '#f59e0b',
    redBodyHex: 0x991b1b,
    blackBodyHex: 0x16161d,
    mistHex: 0xd97706,
  },
  jade: {
    name: '💎 Tiên Cảnh Ngọc Bích',
    bg1: '#e6f0ec',
    bg2: '#c5dcd3',
    frameHex: 0x1e3f35,
    gridStroke: '#065f46',
    riverColor: '#0f766e',
    redBodyHex: 0xb91c1c,
    blackBodyHex: 0x064e3b,
    mistHex: 0x34d399,
  },
  cyber: {
    name: '⚡ Hologram Tương Lai',
    bg1: '#070b19',
    bg2: '#030612',
    frameHex: 0x0f172a,
    gridStroke: '#22d3ee',
    riverColor: '#f43f5e',
    redBodyHex: 0xe11d48,
    blackBodyHex: 0x0284c7,
    mistHex: 0x06b6d4,
  },
};

export function gridToWorld3D(r: number, c: number): { x: number; z: number } {
  return {
    x: (c - 4) * CELL_SIZE,
    z: (r - 4.5) * CELL_SIZE,
  };
}

export function worldToGrid3D(x: number, z: number): Coord | null {
  const c = Math.round(x / CELL_SIZE + 4);
  const r = Math.round(z / CELL_SIZE + 4.5);
  if (r < 0 || r >= 10 || c < 0 || c >= 9) return null;
  const wx = (c - 4) * CELL_SIZE;
  const wz = (r - 4.5) * CELL_SIZE;
  if (Math.hypot(x - wx, z - wz) > CELL_SIZE * 0.48) return null;
  return { r, c };
}

export function computeParabolicPoint(
  start: { x: number; z: number },
  end: { x: number; z: number },
  baseY: number,
  peakHeight: number,
  t: number
): { x: number; y: number; z: number } {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    x: start.x + (end.x - start.x) * clampedT,
    z: start.z + (end.z - start.z) * clampedT,
    y: baseY + 4 * peakHeight * clampedT * (1 - clampedT),
  };
}

export const XiangqiBoard3D: React.FC<XiangqiBoard3DProps> = ({
  board,
  turn: _turn,
  selectedSquare,
  legalMoves,
  lastMove,
  arrowGuides = [],
  labelMode,
  onSquareClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraMode, setCameraMode] = useState<Camera3DMode>('45');
  const [theme, setTheme] = useState<Board3DTheme>('shanshui');
  const [pieceVisualMode, setPieceVisualMode] = useState<PieceVisualMode>('living');
  const [userArrows, setUserArrows] = useState<{ from: Coord; to: Coord }[]>([]);
  const [checkBannerVisible, setCheckBannerVisible] = useState<boolean>(false);

  // Refs for latest callback access inside Three.js event listeners
  const onSquareClickRef = useRef(onSquareClick);
  onSquareClickRef.current = onSquareClick;

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    boardGroup: THREE.Group;
    boardTopMat: THREE.MeshStandardMaterial;
    boardSideMat: THREE.MeshStandardMaterial;
    mistMat: THREE.PointsMaterial;
    piecesRoot: THREE.Group;
    indicatorsRoot: THREE.Group;
    arrowsRoot: THREE.Group;
    trailRoot: THREE.Group;
    checkRoot: THREE.Group;
    vfxRoot: THREE.Group;
    selectionHalo: THREE.Mesh;
    hitPlane: THREE.Mesh;
    pieceMap: Map<string, THREE.Group>;
  } | null>(null);

  const prevBoardRef = useRef<BoardMatrix | null>(null);

  // Compute real-time evaluation bar percentage
  const evalScore = evaluateBoard(board);
  const clampedEval = Math.max(-250, Math.min(250, evalScore));
  const redAdvantagePct = Math.round(50 + (clampedEval / 250) * 45);
  const blackAdvantagePct = 100 - redAdvantagePct;

  // Helper to generate procedural 2048x2240 board canvas texture
  const buildBoardTexture = (themeKey: Board3DTheme, maxAnisotropy: number) => {
    const cfg = THEME_CONFIG[themeKey];
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1760;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(800, 880, 100, 800, 880, 1150);
    grad.addColorStop(0, cfg.bg1);
    grad.addColorStop(1, cfg.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padX = 148;
    const padY = 146;
    const stepX = (canvas.width - padX * 2) / 8;
    const stepY = (canvas.height - padY * 2) / 9;
    const toX = (c: number) => padX + c * stepX;
    const toY = (r: number) => padY + r * stepY;

    ctx.strokeStyle = cfg.gridStroke;
    ctx.shadowColor = cfg.gridStroke;
    ctx.shadowBlur = themeKey === 'cyber' ? 12 : 2;
    ctx.lineWidth = 8;
    ctx.strokeRect(padX - 22, padY - 22, stepX * 8 + 44, stepY * 9 + 44);

    ctx.lineWidth = 3.5;
    for (let r = 0; r < 10; r++) {
      ctx.beginPath();
      ctx.moveTo(toX(0), toY(r));
      ctx.lineTo(toX(8), toY(r));
      ctx.stroke();
    }
    for (let c = 0; c < 9; c++) {
      if (c === 0 || c === 8) {
        ctx.beginPath();
        ctx.moveTo(toX(c), toY(0));
        ctx.lineTo(toX(c), toY(9));
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(toX(c), toY(0));
        ctx.lineTo(toX(c), toY(4));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX(c), toY(5));
        ctx.lineTo(toX(c), toY(9));
        ctx.stroke();
      }
    }

    // Palace diagonals
    ctx.setLineDash([12, 8]);
    [
      [3, 0, 5, 2],
      [5, 0, 3, 2],
      [3, 7, 5, 9],
      [5, 7, 3, 9],
    ].forEach(([c1, r1, c2, r2]) => {
      ctx.beginPath();
      ctx.moveTo(toX(c1), toY(r1));
      ctx.lineTo(toX(c2), toY(r2));
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // River Calligraphy
    ctx.fillStyle = cfg.riverColor;
    ctx.font = '900 46px "Noto Serif", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const riverY = (toY(4) + toY(5)) / 2;
    ctx.fillText('楚河 • SỞ HÀ', toX(2), riverY);
    ctx.fillText('HÁN GIỚI • 漢界', toX(6), riverY);

    // Coordinates
    ctx.font = 'bold 34px "Noto Serif", Georgia, serif';
    for (let c = 0; c < 9; c++) {
      ctx.fillStyle = cfg.gridStroke;
      ctx.fillText(String(c + 1), toX(c), 62);
      ctx.fillStyle = cfg.riverColor;
      ctx.fillText(String(9 - c), toX(c), canvas.height - 62);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    return tex;
  };

  // Helper to build piece cap texture
  const buildPieceCapTexture = (
    type: PieceType,
    side: Side,
    mode: PieceLabelMode,
    maxAnisotropy: number
  ) => {
    const meta = PIECE_VALUES[type];
    const isRed = side === 'r';
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 122);
    if (isRed) {
      grad.addColorStop(0, '#7f1d1d');
      grad.addColorStop(0.8, '#450a0a');
      grad.addColorStop(1, '#280505');
    } else {
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.8, '#0f172a');
      grad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isRed ? '#fbbf24' : '#38bdf8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(128, 128, 108, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isRed ? '#fde68a' : '#e0f2fe';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const han = isRed ? meta.hanRed : meta.hanBlack;
    if (mode === 'hanzi') {
      ctx.font = '900 116px "Noto Serif", serif';
      ctx.fillText(han, 128, 132);
    } else if (mode === 'name') {
      ctx.font = '900 58px "Noto Serif", serif';
      ctx.fillText(meta.nameVi, 128, 128);
    } else if (mode === 'dual') {
      ctx.font = '900 84px "Noto Serif", serif';
      ctx.fillText(han, 128, 108);
      ctx.font = 'bold 34px "Noto Serif", serif';
      ctx.fillText(meta.dualLabel, 128, 182);
    } else {
      ctx.font = '900 92px "Noto Serif", serif';
      ctx.fillText(han, 128, 106);
      ctx.font = 'bold 38px "Noto Serif", serif';
      ctx.fillText(meta.codeVn, 128, 182);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    return tex;
  };

  // Helper to build living 3D character unit (Xianxia Cel-Shaded Shan Shui Edition: Red vs Cyan-Blue + Black Toon Outlines)
  const buildLivingUnit3D = (type: PieceType, side: Side) => {
    const root = new THREE.Group();
    const isRed = side === 'r';

    const toonSteps = new Uint8Array([70, 140, 205, 255]);
    const toonGradTex = new THREE.DataTexture(toonSteps, 4, 1, THREE.RedFormat);
    toonGradTex.minFilter = THREE.NearestFilter;
    toonGradTex.magFilter = THREE.NearestFilter;
    toonGradTex.needsUpdate = true;

    const makeToon = (hex: number) => new THREE.MeshToonMaterial({ color: hex, gradientMap: toonGradTex });

    const redCloth = makeToon(0xdc2626);
    const redGold = makeToon(0xfbbf24);
    const cyanCloth = makeToon(0x0ea5e9);
    const cyanSilver = makeToon(0xe0f2fe);
    const fleshMat = makeToon(0xfde68a);
    const steelMat = makeToon(0xcbd5e1);
    const bronzeMat = makeToon(0xd97706);
    const woodMat = makeToon(0x78350f);
    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x0f0a07, side: THREE.BackSide });

    const mainMat = isRed ? redCloth : cyanCloth;
    const armorMat = isRed ? redGold : cyanSilver;

    // Wooden/Jade Lotus Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.41, 0.44, 0.08, 28),
      woodMat
    );
    pedestal.position.y = 0.04;
    pedestal.receiveShadow = true;
    root.add(pedestal);

    const ringGlow = new THREE.Mesh(
      new THREE.RingGeometry(0.37, 0.42, 32),
      new THREE.MeshBasicMaterial({ color: isRed ? 0xfacc15 : 0x38bdf8, side: THREE.DoubleSide })
    );
    ringGlow.rotation.x = -Math.PI / 2;
    ringGlow.position.y = 0.082;
    ringGlow.userData.noOutline = true;
    root.add(ringGlow);

    const body = new THREE.Group();
    body.position.y = 0.08;
    body.rotation.y = isRed ? Math.PI : 0;
    root.add(body);
    root.userData.bobGroup = body;

    if (type === 'K') {
      // TƯỚNG (General): Seated on ornate Golden Dragon Throne, flowing robes, symmetrical pose
      const throneDais = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.48), redGold);
      throneDais.position.set(0, 0.06, 0);
      body.add(throneDais);
      const throneBack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.78, 0.1), redGold);
      throneBack.position.set(0, 0.52, -0.18);
      body.add(throneBack);
      const throneSeat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.2, 0.42), redGold);
      throneSeat.position.set(0, 0.2, 0);
      body.add(throneSeat);
      [-0.25, 0.25].forEach((xPos) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.32, 0.42), redGold);
        arm.position.set(xPos, 0.3, 0.02);
        body.add(arm);
      });
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.23, 0.48, 16), mainMat);
      torso.position.set(0, 0.52, 0.02);
      body.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), fleshMat);
      head.position.set(0, 0.84, 0.02);
      body.add(head);
      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.2), redGold);
      crown.position.set(0, 1.0, 0.02);
      body.add(crown);
    } else if (type === 'A') {
      // SĨ (Advisor): Female sword cultivator & mystic dancer, silk ribbons, twin fans/daggers
      const dress = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.6, 16), mainMat);
      dress.position.set(0, 0.31, 0);
      body.add(dress);
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.3, 16), armorMat);
      torso.position.set(0, 0.61, 0);
      body.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), fleshMat);
      head.position.set(0, 0.84, 0);
      body.add(head);
      const silkRibbon = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.024, 10, 28, Math.PI * 1.35),
        mainMat
      );
      silkRibbon.position.set(0, 0.66, -0.04);
      silkRibbon.rotation.z = -Math.PI * 0.18;
      body.add(silkRibbon);
      [-1, 1].forEach((dir) => {
        const fan = new THREE.Mesh(new THREE.CircleGeometry(0.17, 14, 0, Math.PI * 0.85), armorMat);
        fan.position.set(dir * 0.24, 0.6, 0.12);
        fan.rotation.y = dir * 0.35;
        body.add(fan);
        const dagger = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.36, 8), steelMat);
        dagger.position.set(dir * 0.22, 0.54, 0.14);
        dagger.rotation.z = dir * -0.42;
        body.add(dagger);
      });
    } else if (type === 'E') {
      // TƯỢNG (Elephant): Heavy-set guardian general in 3-tier wide layered robes, imposing stance
      const robeBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.3, 18), mainMat);
      robeBottom.position.set(0, 0.18, 0);
      body.add(robeBottom);
      const robeMid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 0.3, 18), armorMat);
      robeMid.position.set(0, 0.4, 0);
      body.add(robeMid);
      const robeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.26, 18), mainMat);
      robeTop.position.set(0, 0.6, 0);
      body.add(robeTop);
      const pauldrons = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.2, 0.34), redGold);
      pauldrons.position.set(0, 0.66, 0);
      body.add(pauldrons);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), fleshMat);
      head.position.set(0, 0.86, 0);
      body.add(head);
    } else if (type === 'H') {
      // MÃ (Horse): Cavalry warrior riding armored warhorse in dynamic rearing pose, dragon spear
      const rearingGroup = new THREE.Group();
      rearingGroup.position.set(0, 0.1, -0.05);
      rearingGroup.rotation.x = -0.34;
      body.add(rearingGroup);
      const horseBody = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.6), armorMat);
      horseBody.position.set(0, 0.34, 0);
      rearingGroup.add(horseBody);
      const horseNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.14, 0.36, 12), armorMat);
      horseNeck.position.set(0, 0.54, 0.24);
      horseNeck.rotation.x = 0.55;
      rearingGroup.add(horseNeck);
      const horseHead = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.16, 0.26), steelMat);
      horseHead.position.set(0, 0.7, 0.34);
      rearingGroup.add(horseHead);
      const rider = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.36, 12), mainMat);
      rider.position.set(0, 0.64, -0.02);
      rider.rotation.x = 0.26;
      rearingGroup.add(rider);
      const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), fleshMat);
      riderHead.position.set(0, 0.88, 0.04);
      rearingGroup.add(riderHead);
      const lance = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 1.18, 8), steelMat);
      lance.position.set(0.2, 0.66, 0.22);
      lance.rotation.x = 0.72;
      rearingGroup.add(lance);
    } else if (type === 'R') {
      // XE (Chariot): Load Tripo PBR Meshopt GLB model with procedural fallback while decoding
      if (sharedGltfCache.has('R')) {
        body.add(instantiateChariotForSide(sharedGltfCache.get('R')!, isRed, woodMat, mainMat));
        return root;
      }
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.66), woodMat);
      chassis.position.set(0, 0.22, 0);
      body.add(chassis);
      const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), bronzeMat);
      wheelL.rotation.z = Math.PI / 2;
      wheelL.position.set(-0.28, 0.2, 0);
      body.add(wheelL);
      const wheelR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), bronzeMat);
      wheelR.rotation.z = Math.PI / 2;
      wheelR.position.set(0.28, 0.2, 0);
      body.add(wheelR);
      const bow = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.08, 0.1), steelMat);
      bow.position.set(0, 0.44, 0.16);
      body.add(bow);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.64), redGold);
      rail.position.set(0, 0.36, 0);
      body.add(rail);

      loadChariotGLTFOnce()
        .then((normalizedGroup) => {
          body.clear();
          body.add(instantiateChariotForSide(normalizedGroup, isRed, woodMat, mainMat));
        })
        .catch(() => {});
    } else if (type === 'C') {
      // PHÁO (Cannon): Muscular warrior carrying massive silver-iron bombard cannon on shoulder, crouched stance
      const crouchGroup = new THREE.Group();
      body.add(crouchGroup);
      [-0.13, 0.13].forEach((lx) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.26, 12), mainMat);
        leg.position.set(lx, 0.15, 0);
        leg.rotation.z = lx > 0 ? -0.26 : 0.26;
        crouchGroup.add(leg);
      });
      const muscularChest = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.14, 0.3, 14), fleshMat);
      muscularChest.position.set(0, 0.44, 0);
      muscularChest.rotation.x = 0.18;
      crouchGroup.add(muscularChest);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), fleshMat);
      head.position.set(-0.04, 0.68, 0.04);
      crouchGroup.add(head);
      const bombard = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.7, 16), steelMat);
      bombard.rotation.x = Math.PI / 2 - 0.28;
      bombard.position.set(0.17, 0.6, 0.06);
      crouchGroup.add(bombard);
    } else {
      // TỐT (Soldier): Infantry soldier in tunic & straw/iron hat (Đấu Lĩnh), lunging with curved sabre (Dao)
      const lungeGroup = new THREE.Group();
      lungeGroup.rotation.x = 0.22;
      body.add(lungeGroup);
      const soldierTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.42, 12), mainMat);
      soldierTorso.position.set(0, 0.3, 0);
      lungeGroup.add(soldierTorso);
      const cuirass = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.16, 0.2), armorMat);
      cuirass.position.set(0, 0.32, 0);
      lungeGroup.add(cuirass);
      const soldierHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), fleshMat);
      soldierHead.position.set(0, 0.58, 0);
      lungeGroup.add(soldierHead);
      const conicalHat = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.13, 16), redGold);
      conicalHat.position.set(0, 0.68, 0);
      lungeGroup.add(conicalHat);
      const sword = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.52, 0.1), steelMat);
      sword.position.set(0.22, 0.42, 0.14);
      sword.rotation.z = -0.45;
      sword.rotation.x = 0.3;
      lungeGroup.add(sword);
    }

    // Add Black Ink Inverted-Hull Toon Outlines
    const toOutline: THREE.Mesh[] = [];
    root.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh && !m.userData.noOutline) {
        toOutline.push(m);
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    toOutline.forEach((m) => {
      const outline = new THREE.Mesh(m.geometry, outlineMat);
      outline.scale.set(1.065, 1.065, 1.065);
      m.add(outline);
    });

    return root;
  };

  // Initialize Three.js Scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 668;
    const height = container.clientHeight || 680;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 9.8, 9.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minDistance = 5.5;
    controls.maxDistance = 20;
    controls.enabled = false;

    const ambientLight = new THREE.AmbientLight(0xfff1dc, 0.72);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffe0b2, 2.2);
    dirLight.position.set(6, 13, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 7;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(-7, 6, -8);
    scene.add(rimLight);

    const hoverLight = new THREE.PointLight(0xffd166, 1.3, 3.2);
    hoverLight.position.set(0, 0.85, 0);
    scene.add(hoverLight);

    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const bWidth = CELL_SIZE * 8 + 1.5;
    const bDepth = CELL_SIZE * 9 + 1.5;
    const bThick = 0.54;

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const boardTopMat = new THREE.MeshStandardMaterial({
      map: buildBoardTexture('ebony', maxAniso),
      roughness: 0.25,
      metalness: 0.18,
    });
    const boardSideMat = new THREE.MeshStandardMaterial({
      color: THEME_CONFIG.ebony.frameHex,
      roughness: 0.35,
      metalness: 0.25,
    });

    const boardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth, bThick, bDepth),
      [boardSideMat, boardSideMat, boardTopMat, boardSideMat, boardSideMat, boardSideMat]
    );
    boardMesh.position.y = -bThick / 2;
    boardMesh.receiveShadow = true;
    boardGroup.add(boardMesh);

    const trimMesh = new THREE.Mesh(
      new THREE.BoxGeometry(bWidth + 0.16, bThick * 0.8, bDepth + 0.16),
      new THREE.MeshStandardMaterial({ color: 0xb48327, metalness: 0.8, roughness: 0.22 })
    );
    trimMesh.position.y = -bThick / 2 - 0.03;
    boardGroup.add(trimMesh);

    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(bWidth, bDepth),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitPlane.rotation.x = -Math.PI / 2;
    hitPlane.position.y = BOARD_TOP_Y + 0.01;
    scene.add(hitPlane);

    // Ambient Mist Particles
    const mistCount = 90;
    const mistGeo = new THREE.BufferGeometry();
    const mistPos = new Float32Array(mistCount * 3);
    for (let i = 0; i < mistCount; i++) {
      const ang = (i / mistCount) * Math.PI * 2;
      const rad = 5.3 + Math.random() * 1.8;
      mistPos[i * 3] = Math.cos(ang) * rad;
      mistPos[i * 3 + 1] = -0.15 + Math.random() * 0.7;
      mistPos[i * 3 + 2] = Math.sin(ang) * rad;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
    const mistMat = new THREE.PointsMaterial({
      color: THEME_CONFIG.ebony.mistHex,
      size: 0.14,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    scene.add(mistPoints);

    const piecesRoot = new THREE.Group();
    const indicatorsRoot = new THREE.Group();
    const arrowsRoot = new THREE.Group();
    const trailRoot = new THREE.Group();
    const checkRoot = new THREE.Group();
    const vfxRoot = new THREE.Group();
    scene.add(piecesRoot, indicatorsRoot, arrowsRoot, trailRoot, checkRoot, vfxRoot);

    // Generate Golden Bagua Magic Circle Texture for selected piece
    const baguaCanvas = document.createElement('canvas');
    baguaCanvas.width = 512;
    baguaCanvas.height = 512;
    const bCtx = baguaCanvas.getContext('2d')!;
    const bGrad = bCtx.createRadialGradient(256, 256, 20, 256, 256, 245);
    bGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
    bGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.35)');
    bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    bCtx.fillStyle = bGrad;
    bCtx.fillRect(0, 0, 512, 512);
    bCtx.strokeStyle = '#fef08a';
    bCtx.fillStyle = '#fef08a';
    bCtx.lineWidth = 5;
    bCtx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8;
      const px = 256 + Math.cos(a) * 230;
      const py = 256 + Math.sin(a) * 230;
      if (i === 0) bCtx.moveTo(px, py);
      else bCtx.lineTo(px, py);
    }
    bCtx.closePath();
    bCtx.stroke();
    [205, 150, 105].forEach((r) => {
      bCtx.beginPath();
      bCtx.arc(256, 256, r, 0, Math.PI * 2);
      bCtx.stroke();
    });
    const baguaChars = ['乾', '兌', '離', '震', '巽', '坎', '艮', '坤'];
    bCtx.font = 'bold 28px serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    baguaChars.forEach((ch, i) => {
      const a = (i * Math.PI) / 4;
      bCtx.fillText(ch, 256 + Math.cos(a) * 178, 256 + Math.sin(a) * 178);
    });

    const baguaUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0xf59e0b) },
      uBaguaTex: { value: new THREE.CanvasTexture(baguaCanvas) },
    };
    const selectionHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, 1.65),
      new THREE.ShaderMaterial({
        vertexShader: BAGUA_VERTEX_SHADER,
        fragmentShader: BAGUA_FRAGMENT_SHADER,
        uniforms: baguaUniforms,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    selectionHalo.rotation.x = -Math.PI / 2;
    selectionHalo.position.y = BOARD_TOP_Y + 0.025;
    selectionHalo.visible = false;
    scene.add(selectionHalo);

    const outlineEffect = new OutlineEffect(renderer, {
      defaultThickness: 0.0035,
      defaultColor: [0.06, 0.04, 0.03],
      defaultAlpha: 0.92,
      defaultKeepAlive: true,
    });

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      boardGroup,
      boardTopMat,
      boardSideMat,
      mistMat,
      piecesRoot,
      indicatorsRoot,
      arrowsRoot,
      trailRoot,
      checkRoot,
      vfxRoot,
      selectionHalo,
      hitPlane,
      pieceMap: new Map(),
    };

    // Raycasting for Left Click & Right-Click Tactical Arrow
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let rightStartCoord: Coord | null = null;

    const getEventGridCoord = (e: PointerEvent): Coord | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const pieceHits = raycaster.intersectObjects(piecesRoot.children, true);
      if (pieceHits.length > 0) {
        let obj: THREE.Object3D | null = pieceHits[0].object;
        while (obj && !obj.userData?.isPiece) obj = obj.parent;
        if (obj && obj.userData?.isPiece) {
          return { r: obj.userData.r, c: obj.userData.c };
        }
      }

      const planeHits = raycaster.intersectObject(hitPlane);
      if (planeHits.length > 0) {
        return worldToGrid3D(planeHits[0].point.x, planeHits[0].point.z);
      }
      return null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const planeHits = raycaster.intersectObject(hitPlane);
      if (planeHits.length > 0) {
        hoverLight.position.set(planeHits[0].point.x, 0.85, planeHits[0].point.z);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 2) {
        rightStartCoord = getEventGridCoord(e);
        return;
      }
      if (e.button === 0 && !controls.enabled) {
        const coord = getEventGridCoord(e);
        if (coord) onSquareClickRef.current(coord.r, coord.c);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.button === 2 && rightStartCoord) {
        const endCoord = getEventGridCoord(e);
        if (endCoord) {
          if (endCoord.r === rightStartCoord.r && endCoord.c === rightStartCoord.c) {
            setUserArrows([]);
          } else {
            const start = rightStartCoord;
            setUserArrows((prev) => [...prev, { from: start, to: endCoord }]);
          }
        }
        rightStartCoord = null;
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const domEl = renderer.domElement;
    domEl.addEventListener('pointermove', handlePointerMove);
    domEl.addEventListener('pointerdown', handlePointerDown);
    domEl.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('contextmenu', handleContextMenu);

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      if (controls.enabled) controls.update();
      baguaUniforms.uTime.value = elapsed;
      indicatorsRoot.children.forEach((c) => {
        if (c.userData?.isReticle) c.rotation.y = elapsed * 2.2;
      });
      piecesRoot.children.forEach((c, idx) => {
        if (c.userData?.bobGroup) {
          c.userData.bobGroup.position.y = 0.08 + Math.sin(elapsed * 2.6 + idx * 0.35) * 0.015;
        }
      });
      mistPoints.rotation.y = elapsed * 0.035;
      outlineEffect.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 668;
      const h = container.clientHeight || 680;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      outlineEffect.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('pointermove', handlePointerMove);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('contextmenu', handleContextMenu);
      renderer.dispose();
    };
  }, []);

  // Update Camera View with Smooth GSAP Lerp
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    if (cameraMode === '45') {
      ctx.controls.enabled = false;
      gsap.to(ctx.camera.position, {
        x: 0,
        y: 9.8,
        z: 9.2,
        duration: 0.85,
        ease: 'power3.inOut',
        onUpdate: () => ctx.camera.lookAt(0, 0, 0),
      });
    } else if (cameraMode === 'top') {
      ctx.controls.enabled = false;
      gsap.to(ctx.camera.position, {
        x: 0,
        y: 13.8,
        z: 0.6,
        duration: 0.85,
        ease: 'power3.inOut',
        onUpdate: () => ctx.camera.lookAt(0, 0, 0),
      });
    } else {
      ctx.controls.enabled = true;
    }
  }, [cameraMode]);

  // Update Theme Material
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const cfg = THEME_CONFIG[theme];
    const maxAniso = ctx.renderer.capabilities.getMaxAnisotropy();
    ctx.boardTopMat.map = buildBoardTexture(theme, maxAniso);
    ctx.boardTopMat.needsUpdate = true;
    ctx.boardSideMat.color.setHex(cfg.frameHex);
    ctx.mistMat.color.setHex(cfg.mistHex);
  }, [theme]);

  // Sync Board Pieces & Trigger Parabolic Bézier Trajectory / Capture Shockwave
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const cfg = THEME_CONFIG[theme];
    const maxAniso = ctx.renderer.capabilities.getMaxAnisotropy();

    // Detect if a single move just occurred to animate parabolically
    const prevBoard = prevBoardRef.current;
    const baseY = BOARD_TOP_Y + PIECE_HEIGHT / 2;

    if (
      prevBoard &&
      lastMove &&
      ctx.pieceMap.has(`${lastMove.from.r},${lastMove.from.c}`) &&
      !ctx.pieceMap.has(`${lastMove.to.r},${lastMove.to.c}_moved`)
    ) {
      const fromKey = `${lastMove.from.r},${lastMove.from.c}`;
      const toKey = `${lastMove.to.r},${lastMove.to.c}`;
      const movingMesh = ctx.pieceMap.get(fromKey);
      const capturedMesh = ctx.pieceMap.get(toKey);
      const movedPiece = board[lastMove.to.r][lastMove.to.c];
      const capturedPiece = prevBoard[lastMove.to.r][lastMove.to.c];

      if (movingMesh && movedPiece) {
        const startPos = gridToWorld3D(lastMove.from.r, lastMove.from.c);
        const endPos = gridToWorld3D(lastMove.to.r, lastMove.to.c);
        ctx.pieceMap.delete(fromKey);
        ctx.pieceMap.set(toKey, movingMesh);
        movingMesh.userData.r = lastMove.to.r;
        movingMesh.userData.c = lastMove.to.c;

        let stepTick = 0;
        const proxy = { t: 0 };
        gsap.to(proxy, {
          t: 1,
          duration: 0.38,
          ease: 'power2.inOut',
          onUpdate: () => {
            const pt = computeParabolicPoint(startPos, endPos, baseY, 1.35, proxy.t);
            movingMesh.position.set(pt.x, pt.y, pt.z);
            stepTick++;
            if (stepTick % 2 === 0) {
              const trailOrb = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 8, 8),
                new THREE.MeshBasicMaterial({
                  color: movedPiece.side === 'r' ? 0xfef08a : 0x38bdf8,
                  transparent: true,
                  opacity: 0.78,
                  blending: THREE.AdditiveBlending,
                })
              );
              trailOrb.position.set(pt.x, Math.max(0.08, pt.y * 0.45), pt.z);
              ctx.trailRoot.add(trailOrb);
              gsap.to(trailOrb.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 0.38 });
              gsap.to(trailOrb.material, {
                opacity: 0,
                duration: 0.38,
                onComplete: () => {
                  ctx.trailRoot.remove(trailOrb);
                },
              });
            }
          },
          onComplete: () => {
            movingMesh.position.set(endPos.x, baseY, endPos.z);
            if (capturedMesh) {
              ctx.piecesRoot.remove(capturedMesh);
              // GLSL Golden Shockwave & Volumetric God-Rays + Camera Shake
              const shockUniforms = {
                uProgress: { value: 0.0 },
                uPrimaryColor: { value: new THREE.Color(0xfef08a) },
                uSecondaryColor: { value: new THREE.Color(0xf59e0b) },
              };
              const shockPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(5.2, 5.2),
                new THREE.ShaderMaterial({
                  vertexShader: BAGUA_VERTEX_SHADER,
                  fragmentShader: SHOCKWAVE_GODRAYS_FRAGMENT_SHADER,
                  uniforms: shockUniforms,
                  side: THREE.DoubleSide,
                  transparent: true,
                  blending: THREE.AdditiveBlending,
                  depthWrite: false,
                })
              );
              shockPlane.rotation.x = -Math.PI / 2;
              shockPlane.position.set(endPos.x, BOARD_TOP_Y + 0.035, endPos.z);
              ctx.vfxRoot.add(shockPlane);
              gsap.to(shockUniforms.uProgress, {
                value: 1.0,
                duration: 0.65,
                ease: 'power2.out',
                onComplete: () => {
                  ctx.vfxRoot.remove(shockPlane);
                },
              });

              // Camera Shake
              const ox = ctx.camera.position.x;
              const oy = ctx.camera.position.y;
              gsap.fromTo(
                ctx.camera.position,
                { x: ox - 0.14, y: oy + 0.12 },
                { x: ox, y: oy, duration: 0.32, ease: 'elastic.out(1.2, 0.3)' }
              );

              if (capturedPiece) {
                for (let i = 0; i < 28; i++) {
                  const shard = new THREE.Mesh(
                    new THREE.OctahedronGeometry(0.05, 0),
                    new THREE.MeshBasicMaterial({
                      color: capturedPiece.side === 'r' ? 0xf87171 : 0x38bdf8,
                      transparent: true,
                    })
                  );
                  shard.position.set(endPos.x, BOARD_TOP_Y + 0.14, endPos.z);
                  ctx.vfxRoot.add(shard);
                  const ang = Math.random() * Math.PI * 2;
                  const dist = 0.5 + Math.random() * 1.1;
                  gsap.to(shard.position, {
                    x: endPos.x + Math.cos(ang) * dist,
                    y: BOARD_TOP_Y + 0.35 + Math.random() * 0.8,
                    z: endPos.z + Math.sin(ang) * dist,
                    duration: 0.45,
                  });
                  gsap.to(shard.material, {
                    opacity: 0,
                    duration: 0.45,
                    onComplete: () => {
                      ctx.vfxRoot.remove(shard);
                    },
                  });
                }
              }
            }
          },
        });
        prevBoardRef.current = board;
        return;
      }
    }

    // Full Rebuild of 3D Pieces (e.g., on Lesson Load / Reset / Theme or Label Change)
    while (ctx.piecesRoot.children.length > 0) {
      ctx.piecesRoot.remove(ctx.piecesRoot.children[0]);
    }
    ctx.pieceMap.clear();

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        const p = board[r][c];
        if (!p) continue;
        const isRed = p.side === 'r';
        const grp =
          pieceVisualMode === 'living'
            ? buildLivingUnit3D(p.type, p.side)
            : (() => {
                const g = new THREE.Group();
                const cyl = new THREE.Mesh(
                  new THREE.CylinderGeometry(PIECE_RADIUS * 0.94, PIECE_RADIUS, PIECE_HEIGHT, 36),
                  new THREE.MeshPhysicalMaterial({
                    color: isRed ? cfg.redBodyHex : cfg.blackBodyHex,
                    roughness: 0.15,
                    metalness: isRed ? 0.15 : 0.35,
                    clearcoat: 1.0,
                  })
                );
                cyl.castShadow = true;
                cyl.receiveShadow = true;
                g.add(cyl);

                const torus = new THREE.Mesh(
                  new THREE.TorusGeometry(PIECE_RADIUS * 0.94, 0.02, 14, 40),
                  new THREE.MeshStandardMaterial({
                    color: isRed ? 0xfbbf24 : 0x7dd3fc,
                    metalness: 0.85,
                    roughness: 0.2,
                  })
                );
                torus.rotation.x = Math.PI / 2;
                torus.position.y = PIECE_HEIGHT / 2;
                g.add(torus);

                const cap = new THREE.Mesh(
                  new THREE.CircleGeometry(PIECE_RADIUS * 0.92, 36),
                  new THREE.MeshStandardMaterial({
                    map: buildPieceCapTexture(p.type, p.side, labelMode, maxAniso),
                    roughness: 0.22,
                    metalness: 0.28,
                  })
                );
                cap.rotation.x = -Math.PI / 2;
                cap.position.y = PIECE_HEIGHT / 2 + 0.003;
                g.add(cap);
                return g;
              })();

        const pos = gridToWorld3D(r, c);
        grp.position.set(pos.x, baseY, pos.z);
        grp.userData = { isPiece: true, r, c, type: p.type, side: p.side, bobGroup: grp.userData.bobGroup };
        ctx.piecesRoot.add(grp);
        ctx.pieceMap.set(`${r},${c}`, grp);
      }
    }
    prevBoardRef.current = board;
  }, [board, labelMode, theme, lastMove, pieceVisualMode]);

  // Levitate Selected Piece + Render Valid Move Indicators + Check Laser
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const baseY = BOARD_TOP_Y + PIECE_HEIGHT / 2;

    // Reset all piece heights
    ctx.pieceMap.forEach((mesh, key) => {
      const isSel =
        selectedSquare && key === `${selectedSquare.r},${selectedSquare.c}`;
      gsap.to(mesh.position, {
        y: isSel ? baseY + 0.38 : baseY,
        duration: 0.22,
      });
    });

    if (selectedSquare) {
      const pos = gridToWorld3D(selectedSquare.r, selectedSquare.c);
      ctx.selectionHalo.position.set(pos.x, BOARD_TOP_Y + 0.02, pos.z);
      ctx.selectionHalo.visible = true;
    } else {
      ctx.selectionHalo.visible = false;
    }

    // Legal move orbs & red capture reticles
    while (ctx.indicatorsRoot.children.length > 0) {
      ctx.indicatorsRoot.remove(ctx.indicatorsRoot.children[0]);
    }
    legalMoves.forEach((m) => {
      const pos = gridToWorld3D(m.to.r, m.to.c);
      const isCap = Boolean(board[m.to.r][m.to.c]);
      if (isCap) {
        const reticle = new THREE.Mesh(
          new THREE.RingGeometry(PIECE_RADIUS * 1.06, PIECE_RADIUS * 1.26, 32),
          new THREE.MeshBasicMaterial({
            color: 0xef4444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
          })
        );
        reticle.rotation.x = -Math.PI / 2;
        reticle.position.set(pos.x, BOARD_TOP_Y + 0.03, pos.z);
        reticle.userData = { isReticle: true };
        ctx.indicatorsRoot.add(reticle);
      } else {
        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshStandardMaterial({
            color: 0x34d399,
            emissive: 0x10b981,
            emissiveIntensity: 0.8,
          })
        );
        orb.position.set(pos.x, BOARD_TOP_Y + 0.13, pos.z);
        ctx.indicatorsRoot.add(orb);
      }
    });

    // Check Laser Beam
    while (ctx.checkRoot.children.length > 0) {
      ctx.checkRoot.remove(ctx.checkRoot.children[0]);
    }
    const redChecked = isKingInCheck(board, 'r');
    const blackChecked = isKingInCheck(board, 'b');
    const checkedSide: Side | null = redChecked ? 'r' : blackChecked ? 'b' : null;
    if (checkedSide) {
      setCheckBannerVisible(true);
      const timer = setTimeout(() => setCheckBannerVisible(false), 1200);
      const kingCoord = findKing(board, checkedSide);
      if (kingCoord) {
        const kPos = gridToWorld3D(kingCoord.r, kingCoord.c);
        const opp: Side = checkedSide === 'r' ? 'b' : 'r';
        for (let r = 0; r < 10; r++) {
          for (let c = 0; c < 9; c++) {
            const p = board[r][c];
            if (p && p.side === opp) {
              const pseudo = getPseudoMovesWithBlocks(board, r, c).targets;
              if (pseudo.some((t) => t.r === kingCoord.r && t.c === kingCoord.c)) {
                const aPos = gridToWorld3D(r, c);
                const dx = kPos.x - aPos.x;
                const dz = kPos.z - aPos.z;
                const len = Math.hypot(dx, dz);
                const laser = new THREE.Mesh(
                  new THREE.CylinderGeometry(0.04, 0.04, len, 12),
                  new THREE.MeshBasicMaterial({ color: 0xff1e1e })
                );
                laser.rotation.x = Math.PI / 2;
                laser.position.z = len / 2;
                const lGrp = new THREE.Group();
                lGrp.add(laser);
                lGrp.position.set(aPos.x, BOARD_TOP_Y + PIECE_HEIGHT + 0.05, aPos.z);
                lGrp.rotation.y = Math.atan2(dx, dz);
                ctx.checkRoot.add(lGrp);
              }
            }
          }
        }
      }
      return () => clearTimeout(timer);
    } else {
      setCheckBannerVisible(false);
    }
  }, [selectedSquare, legalMoves, board]);

  // Render 3D Arrows (Preset ArrowGuides + Right-Click User Tactical Arrows)
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    while (ctx.arrowsRoot.children.length > 0) {
      ctx.arrowsRoot.remove(ctx.arrowsRoot.children[0]);
    }
    const allArrows = [
      ...arrowGuides.map((a) => ({ from: a.from, to: a.to, hex: 0xfbbf24 })),
      ...userArrows.map((a) => ({ from: a.from, to: a.to, hex: 0x38bdf8 })),
    ];
    allArrows.forEach(({ from, to, hex }) => {
      if (from.r === to.r && from.c === to.c) return;
      const p1 = gridToWorld3D(from.r, from.c);
      const p2 = gridToWorld3D(to.r, to.c);
      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const totalLen = Math.hypot(dx, dz);
      const headLen = 0.34;
      const shaftLen = Math.max(0.1, totalLen - headLen);

      const grp = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.88,
      });
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, shaftLen, 14),
        mat
      );
      shaft.rotation.x = Math.PI / 2;
      shaft.position.z = shaftLen / 2;
      grp.add(shaft);

      const head = new THREE.Mesh(new THREE.ConeGeometry(0.15, headLen, 18), mat);
      head.rotation.x = Math.PI / 2;
      head.position.z = shaftLen + headLen / 2;
      grp.add(head);

      grp.position.set(p1.x, BOARD_TOP_Y + PIECE_HEIGHT + 0.07, p1.z);
      grp.rotation.y = Math.atan2(dx, dz);
      ctx.arrowsRoot.add(grp);
    });
  }, [arrowGuides, userArrows]);

  return (
    <div className="w-full flex flex-col items-center gap-2.5 select-none">
      {/* Top 3D Control Bar: Camera Lerp Angles, PBR Themes, Standalone Studio Link */}
      <div className="w-full max-w-[660px] lg:max-w-[700px] flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#1c1714] border border-[#443528] text-xs font-serif">
        <div className="flex items-center gap-1.5">
          <span className="text-[#cbbdaf] font-bold">Góc 3D:</span>
          {(
            [
              { id: '45', label: '45° Điện Ảnh' },
              { id: 'top', label: '2.5D Từ Trên' },
              { id: 'free', label: '360° Xoay' },
            ] as { id: Camera3DMode; label: string }[]
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCameraMode(c.id)}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                cameraMode === c.id
                  ? 'bg-[#dfb673] text-[#1a1107]'
                  : 'bg-[#261f1a] text-[#e6ded2] hover:bg-[#332720]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPieceVisualMode((prev) => (prev === 'living' ? 'disc' : 'living'))}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              pieceVisualMode === 'living'
                ? 'bg-amber-500/25 border border-amber-400/50 text-[#f6d28b]'
                : 'bg-[#261f1a] text-[#cbbdaf] hover:bg-[#332720]'
            }`}
            title="Chuyển đổi giữa Tướng sống 3D và Quân ngọc PBR"
          >
            {pieceVisualMode === 'living' ? '⚔️ Tướng Sống 3D' : '💎 Đĩa Ngọc PBR'}
          </button>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Board3DTheme)}
            className="px-2.5 py-1 rounded-lg bg-[#261f1a] border border-[#443528] text-[#f6d28b] font-bold focus:outline-none cursor-pointer"
          >
            {Object.entries(THEME_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>

          <a
            href="/xiangqi-3d.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#8c221e] hover:bg-[#a62b27] text-[#fcedc7] font-bold border border-[#b83833] transition"
            title="Mở bản 3D Toàn Màn Hình độc lập"
          >
            ⛶ Fullscreen 3D
          </a>
        </div>
      </div>

      {/* Main 3D Stage + Real-time Evaluation Bar */}
      <div className="w-full max-w-[660px] lg:max-w-[700px] flex items-stretch gap-2.5 relative">
        {/* Real-time Vertical Evaluation Bar */}
        <div
          className="w-6 rounded-xl bg-[#181310] border border-[#443528] p-1 flex flex-col justify-between items-center relative overflow-hidden shrink-0 shadow-lg"
          title="Thanh đánh giá ưu thế Đỏ / Đen theo thời gian thực"
        >
          <div className="w-full h-full rounded-lg overflow-hidden flex flex-col">
            <div
              className="w-full bg-gradient-to-b from-slate-900 to-cyan-950 transition-all duration-500"
              style={{ height: `${blackAdvantagePct}%` }}
            />
            <div
              className="w-full bg-gradient-to-t from-red-900 via-red-700 to-amber-500 transition-all duration-500"
              style={{ height: `${redAdvantagePct}%` }}
            />
          </div>
          <span className="absolute top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-black/85 text-[9px] font-mono font-bold text-[#f6d28b] border border-[#dfb673]/40">
            {(evalScore / 10).toFixed(1)}
          </span>
        </div>

        {/* WebGL Viewport */}
        <div className="flex-1 h-[580px] sm:h-[640px] rounded-2xl board-outer-frame overflow-hidden relative shadow-2xl">
          <div ref={mountRef} className="w-full h-full" />

          {/* Check 3D Calligraphy Banner Overlay */}
          {checkBannerVisible && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-red-950/25 animate-pulse">
              <span className="font-serif font-black text-6xl text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.95)]">
                將！CHIẾU TƯỚNG
              </span>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-[#e6ded2]/80 font-serif">
            <span>Chuột trái: Chọn & bay quân Parabol</span>
            <span>Kéo chuột phải: Vẽ mũi tên 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
};

