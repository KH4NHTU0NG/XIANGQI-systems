const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { MeshoptDecoder, MeshoptSimplifier } = require('../node_modules/meshoptimizer');

const DOC_DIR = '/Users/trankhanhtuong/Documents';
const modelFolder = fs.readdirSync(DOC_DIR).find((d) => d.startsWith('MODEL'));
if (!modelFolder) {
  throw new Error('Cannot find MODEL_CỜ directory in /Users/trankhanhtuong/Documents');
}
const SRC_DIR = path.join(DOC_DIR, modelFolder);
const PUBLIC_MODELS_DIR = path.join(__dirname, '../public/models');
const DESKTOP_MODELS_DIR = '/Users/trankhanhtuong/Desktop/models';
const SCRATCH_DIR = '/Users/trankhanhtuong/.gemini/antigravity/brain/494abd1b-bfad-48db-9f2d-61b7615af9f5/scratch/glb_inspect';

fs.mkdirSync(PUBLIC_MODELS_DIR, { recursive: true });
fs.mkdirSync(DESKTOP_MODELS_DIR, { recursive: true });
fs.mkdirSync(SCRATCH_DIR, { recursive: true });

const MODEL_SPECS = [
  {
    key: 'K_r',
    outFile: 'tuong_red.glb',
    match: 'Tướng-2',
    yawDeg: -90,
    targetHeight: 1.08,
    maxSpanXZ: 1.02,
    gamma: 0.95,
    gain: 1.0,
    satBoost: 1.35,
  },
  {
    key: 'K_b',
    outFile: 'tuong_blue.glb',
    match: 'Tướng-1',
    yawDeg: -90,
    targetHeight: 1.12,
    maxSpanXZ: 0.90,
    gamma: 0.92,
    gain: 1.04,
    satBoost: 1.38,
  },
  {
    key: 'A',
    outFile: 'si.glb',
    match: 'Sĩ',
    yawDeg: -90,
    targetHeight: 1.00,
    maxSpanXZ: 0.95,
    gamma: 0.96,
    gain: 1.0,
    satBoost: 1.36,
  },
  {
    key: 'B',
    outFile: 'tuong_voi.glb',
    match: 'Tượng',
    yawDeg: -90,
    targetHeight: 1.04,
    maxSpanXZ: 0.92,
    gamma: 0.92,
    gain: 1.04,
    satBoost: 1.38,
  },
  {
    key: 'N',
    outFile: 'ma.glb',
    match: 'Mã',
    yawDeg: -90,
    targetHeight: 1.05,
    maxSpanXZ: 0.96,
    gamma: 0.98,
    gain: 0.98,
    satBoost: 1.35,
  },
  {
    key: 'R',
    outFile: 'xe.glb',
    match: 'Xe',
    yawDeg: -90,
    targetHeight: 0.84,
    maxSpanXZ: 1.02,
    gamma: 0.90,
    gain: 1.02,
    satBoost: 1.55,
    isChariot: true,
  },
  {
    key: 'C',
    outFile: 'phao.glb',
    match: 'Pháo',
    yawDeg: -152,
    targetHeight: 0.98,
    maxSpanXZ: 0.96,
    gamma: 0.95,
    gain: 1.0,
    satBoost: 1.35,
  },
  {
    key: 'P',
    outFile: 'chot.glb',
    match: 'Chốt',
    yawDeg: -90,
    targetHeight: 0.92,
    maxSpanXZ: 0.92,
    gamma: 0.95,
    gain: 1.0,
    satBoost: 1.35,
  },
];

function brightenAndResizeJpeg(rawJpgBuf, tempPrefix, gamma, gain, satBoost = 1.35, isChariot = false) {
  const inJpg = path.join(SCRATCH_DIR, `${tempPrefix}_in.jpg`);
  const bmpPath = path.join(SCRATCH_DIR, `${tempPrefix}_1024.bmp`);
  const outJpg = path.join(SCRATCH_DIR, `${tempPrefix}_out.jpg`);
  fs.writeFileSync(inJpg, rawJpgBuf);
  execSync(`sips -z 1024 1024 -s format bmp "${inJpg}" --out "${bmpPath}" >/dev/null 2>&1`);

  const bmp = fs.readFileSync(bmpPath);
  const off = bmp.readUInt32LE(10);
  const w = bmp.readInt32LE(18);
  const h = Math.abs(bmp.readInt32LE(22));
  const bpp = bmp.readUInt16LE(28) / 8;
  const stride = Math.ceil((w * bpp) / 4) * 4;

  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const v = Math.pow(i / 255, gamma) * gain * 255;
    lut[i] = Math.min(255, Math.max(0, Math.round(v)));
  }

  for (let y = 0; y < h; y++) {
    const rowStart = off + y * stride;
    for (let x = 0; x < w; x++) {
      const idx = rowStart + x * bpp;
      let b = lut[bmp[idx]];
      let g = lut[bmp[idx + 1]];
      let r = lut[bmp[idx + 2]];

      if (isChariot) {
        // Enrich Ebony/Rosewood & Antique Bronze/Dark Silver tones on Xe (Chariot)
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (r >= g && g >= b * 0.85 && lum < 175) {
          // Warm dark wood & bronze: deepen warm amber/ebony contrast
          r = Math.min(255, Math.round(r * 1.18 + 8));
          g = Math.min(255, Math.round(g * 0.96));
          b = Math.max(0, Math.round(b * 0.76));
        } else if (lum >= 145) {
          // Metallic crossbow parts: antique tarnished silver-bronze instead of stark white
          r = Math.min(235, Math.round(r * 0.92));
          g = Math.min(228, Math.round(g * 0.90));
          b = Math.min(220, Math.round(b * 0.88));
        }
      }

      // Boost saturation around luminance so colors are rich and never washed out
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      r = Math.min(255, Math.max(0, Math.round(luma + (r - luma) * satBoost)));
      g = Math.min(255, Math.max(0, Math.round(luma + (g - luma) * satBoost)));
      b = Math.min(255, Math.max(0, Math.round(luma + (b - luma) * satBoost)));

      bmp[idx] = b;
      bmp[idx + 1] = g;
      bmp[idx + 2] = r;
    }
  }

  fs.writeFileSync(bmpPath, bmp);
  execSync(`sips -s format jpeg -s formatOptions 85 "${bmpPath}" --out "${outJpg}" >/dev/null 2>&1`);
  const finalJpg = fs.readFileSync(outJpg);
  return { finalJpg, bmp, off, w, h, bpp, stride, topDown: bmp.readInt32LE(22) < 0 };
}

function buildStandardGLB(posF32, normF32, uvF32, indicesU16, jpegBuf, minPos, maxPos) {
  const pad4 = (n) => (4 - (n % 4)) % 4;

  const imgLen = jpegBuf.length;
  const imgPad = pad4(imgLen);

  const posBytes = Buffer.from(posF32.buffer, posF32.byteOffset, posF32.byteLength);
  const normBytes = Buffer.from(normF32.buffer, normF32.byteOffset, normF32.byteLength);
  const uvBytes = Buffer.from(uvF32.buffer, uvF32.byteOffset, uvF32.byteLength);
  const idxBytes = Buffer.from(indicesU16.buffer, indicesU16.byteOffset, indicesU16.byteLength);
  const idxPad = pad4(idxBytes.length);

  let offset = 0;
  const bvImg = { buffer: 0, byteOffset: offset, byteLength: imgLen };
  offset += imgLen + imgPad;

  const bvPos = { buffer: 0, byteOffset: offset, byteLength: posBytes.length, target: 34962 };
  offset += posBytes.length;

  const bvNorm = { buffer: 0, byteOffset: offset, byteLength: normBytes.length, target: 34962 };
  offset += normBytes.length;

  const bvUv = { buffer: 0, byteOffset: offset, byteLength: uvBytes.length, target: 34962 };
  offset += uvBytes.length;

  const bvIdx = { buffer: 0, byteOffset: offset, byteLength: idxBytes.length, target: 34963 };
  offset += idxBytes.length + idxPad;

  const vCount = posF32.length / 3;
  const iCount = indicesU16.length;

  const gltfJson = {
    asset: { version: '2.0', generator: 'Xiangqi3D-Masterpiece-Optimizer' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: 'XiangqiPiece' }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
            indices: 3,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        name: 'XiangqiToonMat',
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          metallicFactor: 0.0,
          roughnessFactor: 0.85,
        },
      },
    ],
    textures: [{ sampler: 0, source: 0 }],
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 10497, wrapT: 10497 }],
    images: [{ bufferView: 0, mimeType: 'image/jpeg' }],
    bufferViews: [bvImg, bvPos, bvNorm, bvUv, bvIdx],
    accessors: [
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126,
        count: vCount,
        type: 'VEC3',
        min: minPos,
        max: maxPos,
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5126,
        count: vCount,
        type: 'VEC3',
      },
      {
        bufferView: 3,
        byteOffset: 0,
        componentType: 5126,
        count: vCount,
        type: 'VEC2',
      },
      {
        bufferView: 4,
        byteOffset: 0,
        componentType: 5123,
        count: iCount,
        type: 'SCALAR',
      },
    ],
    buffers: [{ byteLength: offset }],
  };

  let jsonStr = JSON.stringify(gltfJson);
  while (Buffer.byteLength(jsonStr, 'utf8') % 4 !== 0) {
    jsonStr += ' ';
  }
  const jsonBuf = Buffer.from(jsonStr, 'utf8');

  const binBuf = Buffer.concat([
    jpegBuf,
    Buffer.alloc(imgPad),
    posBytes,
    normBytes,
    uvBytes,
    idxBytes,
    Buffer.alloc(idxPad),
  ]);

  const totalLen = 12 + 8 + jsonBuf.length + 8 + binBuf.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLen, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuf.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuf.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  return Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuf]);
}

async function run() {
  await MeshoptDecoder.ready;
  await MeshoptSimplifier.ready;

  const srcFiles = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.glb'));
  const inlineMap = {};

  for (let sIdx = 0; sIdx < MODEL_SPECS.length; sIdx++) {
    const spec = MODEL_SPECS[sIdx];
    const matchFile = srcFiles.find((f) => f.normalize('NFC').includes(spec.match.normalize('NFC')));
    if (!matchFile) {
      throw new Error(`Missing source GLB for ${spec.key} (${spec.match})`);
    }

    const rawGlb = fs.readFileSync(path.join(SRC_DIR, matchFile));
    const jsonLen = rawGlb.readUInt32LE(12);
    const json = JSON.parse(rawGlb.subarray(20, 20 + jsonLen).toString('utf8'));
    const binStart = 20 + jsonLen + 8;
    const binChunk = rawGlb.subarray(binStart);

    const bv0 = json.bufferViews[0];
    const rawJpg = rawGlb.subarray(binStart + (bv0.byteOffset || 0), binStart + (bv0.byteOffset || 0) + bv0.byteLength);
    const texInfo = brightenAndResizeJpeg(rawJpg, spec.key, spec.gamma, spec.gain, spec.satBoost, spec.isChariot);

    function decodeBV(bvIdx) {
      const bv = json.bufferViews[bvIdx];
      const ext = bv.extensions.EXT_meshopt_compression;
      const comp = new Uint8Array(binChunk.buffer, binChunk.byteOffset + ext.byteOffset, ext.byteLength);
      const out = new Uint8Array(ext.count * ext.byteStride);
      MeshoptDecoder.decodeGltfBuffer(out, ext.count, ext.byteStride, comp, ext.mode, ext.filter);
      return { buf: out.buffer, count: ext.count, stride: ext.byteStride };
    }
    const rawPos = new Float32Array(decodeBV(3).buf);
    const rawNorm = new Int8Array(decodeBV(4).buf);
    const rawUv = new Float32Array(decodeBV(5).buf);
    const rawIndices = new Uint32Array(decodeBV(6).buf, 0, json.accessors[3].count);

    const targetIndices = spec.key === 'R' ? 39000 : 48000;
    const [simIdx] = MeshoptSimplifier.simplify(rawIndices, rawPos, 3, targetIndices, 0.03, ['LockBorder']);
    const compactIndices = new Uint32Array(simIdx);
    const [remap, uniqueVerts] = MeshoptSimplifier.compactMesh(compactIndices);

    const rad = (spec.yawDeg * Math.PI) / 180;
    const cosY = Math.cos(rad);
    const sinY = Math.sin(rad);

    const posF32 = new Float32Array(uniqueVerts * 3);
    const normF32 = new Float32Array(uniqueVerts * 3);
    const uvF32 = new Float32Array(uniqueVerts * 2);

    let minX = 1e9, minY = 1e9, minZ = 1e9;
    let maxX = -1e9, maxY = -1e9, maxZ = -1e9;

    for (let oldIdx = 0; oldIdx < remap.length; oldIdx++) {
      const newIdx = remap[oldIdx];
      if (newIdx === 0xffffffff || newIdx >= uniqueVerts) continue;

      const ox = rawPos[oldIdx * 3];
      const oy = rawPos[oldIdx * 3 + 1];
      const oz = rawPos[oldIdx * 3 + 2];

      const rx = ox * cosY + oz * sinY;
      const ry = oy;
      const rz = -ox * sinY + oz * cosY;

      posF32[newIdx * 3] = rx;
      posF32[newIdx * 3 + 1] = ry;
      posF32[newIdx * 3 + 2] = rz;

      if (rx < minX) minX = rx; if (rx > maxX) maxX = rx;
      if (ry < minY) minY = ry; if (ry > maxY) maxY = ry;
      if (rz < minZ) minZ = rz; if (rz > maxZ) maxZ = rz;

      let nx = rawNorm[oldIdx * 4];
      let ny = rawNorm[oldIdx * 4 + 1];
      let nz = rawNorm[oldIdx * 4 + 2];
      const nLen = Math.hypot(nx, ny, nz);
      if (nLen > 1e-4) {
        nx /= nLen; ny /= nLen; nz /= nLen;
      } else {
        nx = 0; ny = 1; nz = 0;
      }
      normF32[newIdx * 3] = nx * cosY + nz * sinY;
      normF32[newIdx * 3 + 1] = ny;
      normF32[newIdx * 3 + 2] = -nx * sinY + nz * cosY;

      uvF32[newIdx * 2] = rawUv[oldIdx * 2];
      uvF32[newIdx * 2 + 1] = rawUv[oldIdx * 2 + 1];
    }

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const spanZ = maxZ - minZ;
    const scaleByH = spec.targetHeight / (spanY || 1);
    const scaleByXZ = spec.maxSpanXZ / (Math.max(spanX, spanZ) || 1);
    const finalScale = Math.min(scaleByH, scaleByXZ);

    const cx = (minX + maxX) / 2;
    const cz = (minZ + maxZ) / 2;

    let fMinX = 1e9, fMinY = 1e9, fMinZ = 1e9;
    let fMaxX = -1e9, fMaxY = -1e9, fMaxZ = -1e9;

    for (let i = 0; i < uniqueVerts; i++) {
      const fx = (posF32[i * 3] - cx) * finalScale;
      const fy = (posF32[i * 3 + 1] - minY) * finalScale;
      const fz = (posF32[i * 3 + 2] - cz) * finalScale;
      posF32[i * 3] = fx;
      posF32[i * 3 + 1] = fy;
      posF32[i * 3 + 2] = fz;
      if (fx < fMinX) fMinX = fx; if (fx > fMaxX) fMaxX = fx;
      if (fy < fMinY) fMinY = fy; if (fy > fMaxY) fMaxY = fy;
      if (fz < fMinZ) fMinZ = fz; if (fz > fMaxZ) fMaxZ = fz;
    }

    const indicesU16 = new Uint16Array(compactIndices.length);
    for (let i = 0; i < compactIndices.length; i++) {
      indicesU16[i] = compactIndices[i];
    }

    const outGlb = buildStandardGLB(
      posF32,
      normF32,
      uvF32,
      indicesU16,
      texInfo.finalJpg,
      [fMinX, fMinY, fMinZ],
      [fMaxX, fMaxY, fMaxZ]
    );

    const pubPath = path.join(PUBLIC_MODELS_DIR, spec.outFile);
    const deskPath = path.join(DESKTOP_MODELS_DIR, spec.outFile);
    fs.writeFileSync(pubPath, outGlb);
    fs.writeFileSync(deskPath, outGlb);

    if (spec.key === 'R') {
      fs.writeFileSync(path.join(PUBLIC_MODELS_DIR, 'xe_chariot.glb'), outGlb);
      fs.writeFileSync(path.join(DESKTOP_MODELS_DIR, 'xe_chariot.glb'), outGlb);
    }

    inlineMap[spec.key] = outGlb.toString('base64');
    console.log(
      `Built ${spec.outFile} (${spec.key}): ${(outGlb.length / 1024).toFixed(1)} KB | Size: ${(fMaxX - fMinX).toFixed(
        2
      )} x ${(fMaxY - fMinY).toFixed(2)} x ${(fMaxZ - fMinZ).toFixed(2)}`
    );
  }

  // Provide aliases so both ('E','H') and ('B','N') piece codes resolve immediately
  const inlineJsContent = `// Auto-generated 8-Model 3D Xiangqi Inline Bundle (Standard Float32 GLB)
window.__PRELOADED_ALL_GLB_BASE64__ = ${JSON.stringify(inlineMap)};
window.__PRELOADED_ALL_GLB_BASE64__.K = window.__PRELOADED_ALL_GLB_BASE64__.K_r;
window.__PRELOADED_ALL_GLB_BASE64__.E = window.__PRELOADED_ALL_GLB_BASE64__.B;
window.__PRELOADED_ALL_GLB_BASE64__.H = window.__PRELOADED_ALL_GLB_BASE64__.N;
window.__PRELOADED_XE_GLB_BASE64__ = window.__PRELOADED_ALL_GLB_BASE64__.R;
`;
  fs.writeFileSync(path.join(PUBLIC_MODELS_DIR, 'all_pieces_inline.js'), inlineJsContent);
  fs.writeFileSync(path.join(DESKTOP_MODELS_DIR, 'all_pieces_inline.js'), inlineJsContent);
  fs.writeFileSync(path.join(PUBLIC_MODELS_DIR, 'xe_chariot_inline.js'), inlineJsContent);
  fs.writeFileSync(path.join(DESKTOP_MODELS_DIR, 'xe_chariot_inline.js'), inlineJsContent);

  console.log('Successfully generated all_pieces_inline.js & xe_chariot_inline.js');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
