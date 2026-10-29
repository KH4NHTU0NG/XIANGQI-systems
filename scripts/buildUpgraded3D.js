import fs from 'fs';
import path from 'path';

const ROOT = '/Users/trankhanhtuong/.gemini/antigravity/scratch/xiangqi-mastery-system';
const masteryData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/masteryData.json'), 'utf8'));

// Generate the complete single-file standalone masterpiece HTML
const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CỜ TƯỚNG 3D TU TIÊN — Xianxia Xiangqi 4K Masterpiece</title>
  <!-- TailwindCSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- GSAP 3.12 CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <!-- Google Fonts: Calligraphy & Classical Serif -->
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&family=Noto+Serif+SC:wght@700;900&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <!-- Three.js r160 ES Module ImportMap -->
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
      }
    }
  </script>
  <style>
    * {
      user-select: none;
      -webkit-user-select: none;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      overflow: hidden;
      background: radial-gradient(circle at 50% 48%, #e8e2d8 0%, #ded6ca 45%, #cfc5b6 100%);
      font-family: 'Noto Serif', Georgia, serif;
      color: #231811;
    }
    .calligraphy-cn {
      font-family: 'Ma Shan Zheng', 'Zhi Mang Xing', 'Noto Serif SC', serif;
    }

    /* Traditional Chinese Auspicious Clouds (Tường Vân / 祥云) */
    .auspicious-cloud {
      pointer-events: none;
      position: fixed;
      z-index: 10;
      opacity: 0.52;
      filter: drop-shadow(0 4px 16px rgba(180, 160, 140, 0.25));
      animation: floatCloud 12s ease-in-out infinite alternate;
    }
    @keyframes floatCloud {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(18px, -10px) scale(1.05); }
    }

    /* Organic SVG Ink-Blot Buttons (Bất đối xứng, loang mực tự nhiên) */
    .ink-btn {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 8px 16px rgba(25, 18, 12, 0.55));
      transition: transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.26s ease;
      z-index: 25;
    }
    .ink-btn:hover {
      transform: scale(1.1);
      filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.65)) drop-shadow(0 8px 20px rgba(10, 6, 3, 0.7));
    }
    .ink-btn:active {
      transform: scale(0.94);
    }
    .ink-btn svg {
      display: block;
      transition: transform 0.3s ease;
    }
    .ink-btn:hover svg {
      transform: scale(1.03) rotate(-2deg);
    }

    /* Drag & Drop Visual Overlay */
    #drop-overlay {
      position: fixed;
      inset: 0;
      z-index: 60;
      background: rgba(22, 16, 12, 0.88);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 3px dashed #f59e0b;
      margin: 20px;
      border-radius: 24px;
    }

    /* Vignette on Check / Alert */
    #check-vignette {
      pointer-events: none;
      opacity: 0;
      background: radial-gradient(circle, transparent 40%, rgba(220, 38, 38, 0.45) 85%, rgba(245, 158, 11, 0.5) 100%);
      transition: opacity 0.2s ease;
    }
    #check-banner {
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
      text-shadow: 0 0 45px rgba(250, 204, 21, 0.95), 0 0 20px rgba(220, 38, 38, 0.9);
    }
  </style>
</head>
<body class="relative w-screen h-screen overflow-hidden">

  <!-- 3D WebGL Canvas Container -->
  <div id="canvas-container" class="absolute inset-0 z-0"></div>

  <!-- AUSPICIOUS CLOUDS (TƯỜNG VÂN / 祥云) — MỀM MẠI, KHÔNG NÉT ĐEN SẮC CẠNH, KHÔNG NÚI NON -->
  <!-- Top-Left Corner Cloud -->
  <svg class="auspicious-cloud top-2 left-3 w-64 h-36" viewBox="0 0 320 180" fill="none">
    <path d="M40 130 C20 130 10 110 25 95 C15 75 35 50 65 55 C80 30 125 25 155 50 C180 35 220 40 235 65 C265 60 290 85 280 110 C300 120 305 140 285 150 C260 160 80 160 40 130 Z" fill="rgba(255, 252, 245, 0.65)"/>
    <path d="M70 115 C55 115 50 100 60 90 C75 75 105 85 100 105 C120 90 145 100 140 115" stroke="rgba(235, 225, 210, 0.85)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M165 105 C185 85 220 90 225 115 C240 105 260 115 255 128" stroke="rgba(235, 225, 210, 0.85)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Classic cloud coil spiral -->
    <path d="M110 75 C125 55 155 60 155 80 C155 95 135 100 125 90 C118 82 125 72 135 75" stroke="rgba(230, 218, 200, 0.75)" stroke-width="2.5" fill="none"/>
  </svg>

  <!-- Top-Right Corner Cloud -->
  <svg class="auspicious-cloud top-3 right-4 w-72 h-40" style="animation-delay: -4s;" viewBox="0 0 320 180" fill="none">
    <path d="M280 130 C300 130 310 110 295 95 C305 75 285 50 255 55 C240 30 195 25 165 50 C140 35 100 40 85 65 C55 60 30 85 40 110 C20 120 15 140 35 150 C60 160 240 160 280 130 Z" fill="rgba(255, 252, 245, 0.6)"/>
    <path d="M250 115 C265 115 270 100 260 90 C245 75 215 85 220 105 C200 90 175 100 180 115" stroke="rgba(235, 225, 210, 0.85)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M210 75 C195 55 165 60 165 80 C165 95 185 100 195 90 C202 82 195 72 185 75" stroke="rgba(230, 218, 200, 0.75)" stroke-width="2.5" fill="none"/>
  </svg>

  <!-- Bottom-Left Corner Cloud -->
  <svg class="auspicious-cloud bottom-3 left-4 w-68 h-36" style="animation-delay: -7s;" viewBox="0 0 320 180" fill="none">
    <path d="M40 120 C20 120 10 100 25 85 C15 65 35 45 65 50 C85 25 130 20 160 45 C185 30 225 35 240 60 C270 55 295 80 285 105 C305 115 310 135 290 145 C265 155 80 155 40 120 Z" fill="rgba(255, 252, 245, 0.58)"/>
    <path d="M80 105 C65 105 60 90 70 80 C85 65 115 75 110 95" stroke="rgba(235, 225, 210, 0.8)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </svg>

  <!-- Bottom-Right Corner Cloud -->
  <svg class="auspicious-cloud bottom-2 right-6 w-60 h-32" style="animation-delay: -2s;" viewBox="0 0 320 180" fill="none">
    <path d="M270 120 C290 120 300 100 285 85 C295 65 275 45 245 50 C225 25 180 20 150 45 C125 30 85 35 70 60 C40 55 15 80 25 105 C5 115 0 135 20 145 C45 155 230 155 270 120 Z" fill="rgba(255, 252, 245, 0.55)"/>
  </svg>

  <!-- Check Vignette & Floating Calligraphy Check Banner -->
  <div id="check-vignette" class="fixed inset-0 z-20"></div>
  <div id="check-banner" class="fixed top-1/2 left-1/2 z-30 flex flex-col items-center">
    <span class="calligraphy-cn text-8xl sm:text-9xl font-black text-amber-300 tracking-widest drop-shadow-2xl">將！</span>
    <span class="calligraphy-cn mt-1 px-7 py-1 rounded-full bg-stone-950/90 border-2 border-amber-400 text-amber-200 font-bold text-2xl tracking-widest shadow-2xl">
      劍氣照將 • CHIẾU TƯỚNG!
    </span>
  </div>

  <!-- HUD BÊN TRÁI: NÚT VẾT MỰC CAMERA VẼ TAY (KHÔNG GHI CHỮ 'GÓC 3D') -->
  <div class="fixed left-[10%] sm:left-[14%] top-[45%] -translate-y-1/2 z-30">
    <div id="btn-camera" class="ink-btn w-20 h-20" title="Chuyển đổi góc nhìn Camera (55° Isometric / 2D Thẳng đứng / Tự do)">
      <svg class="w-full h-full" viewBox="0 0 90 90" fill="none">
        <!-- Organic ink blot with spatter edges -->
        <path d="M46 7 C62 5 77 17 81 33 C85 50 78 68 66 78 C52 89 31 87 18 78 C5 68 3 49 8 33 C13 16 29 9 46 7 Z" fill="#130e0b"/>
        <!-- Inner sketchy dry-brush circle -->
        <circle cx="45" cy="45" r="32" stroke="rgba(255, 252, 240, 0.82)" stroke-width="2.2" stroke-dasharray="16 6 28 5 18 7" fill="none"/>
        <!-- Hand-drawn vector camera icon -->
        <rect x="26" y="34" width="38" height="26" rx="4.5" stroke="#fffdf8" stroke-width="2.8" fill="none"/>
        <circle cx="45" cy="47" r="7.2" stroke="#fffdf8" stroke-width="2.6" fill="none"/>
        <path d="M37 34 L40 27 L50 27 L53 34" stroke="#fffdf8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="56" cy="39" r="1.8" fill="#fffdf8"/>
      </svg>
    </div>
  </div>

  <!-- HUD BÊN PHẢI: 4 NÚT VẾT MỰC HỮU CƠ XẾP THEO ĐƯỜNG CONG TỰ NHIÊN -->
  <div class="fixed right-[8%] sm:right-[13%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-5">

    <!-- Nút 1: ÂM THANH (HÌNH HỒ LÔ MỰC ĐEN ĐẶC TRƯNG) -->
    <div class="transform -translate-x-3">
      <div id="btn-sound" class="ink-btn w-20 h-24" title="Bật / Tắt Âm thanh Cổ Cầm & Kiếm Khí">
        <svg class="w-full h-full" viewBox="0 0 80 96" fill="none">
          <!-- Calabash / Gourd organic ink shape: narrow top bulb, waist, larger bottom bulb -->
          <path d="M40 5 C47 5 53 10 54 18 C55 24 50 29 46 33 C56 36 67 46 68 59 C69 74 58 89 40 90 C22 89 11 74 12 59 C13 46 24 36 34 33 C30 29 25 24 26 18 C27 10 33 5 40 5 Z" fill="#130e0b"/>
          <path d="M38 2 C40 1 42 1 43 3 C44 5 42 7 40 6" stroke="#130e0b" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Inner sketchy brush curve on gourd -->
          <path d="M28 62 C28 75 34 82 48 82 C60 82 61 72 58 64" stroke="rgba(255, 252, 240, 0.75)" stroke-width="2" stroke-dasharray="14 5 20 6" fill="none"/>
          <!-- Text: 声音 (Âm thanh) in white serif/calligraphy -->
          <text x="40" y="60" text-anchor="middle" font-size="19" font-family="'Ma Shan Zheng', serif" font-weight="900" fill="#fefdf9" letter-spacing="1">声音</text>
        </svg>
      </div>
    </div>

    <!-- Nút 2: HỐI TIẾC (HÌNH VẾT MỰC LOANG LỔ + VÒNG NÉT CỌ TRẮNG ĐỨT NÉT) -->
    <div class="transform translate-x-2">
      <div id="btn-undo" class="ink-btn w-20 h-20" title="Hối tiếc — Đi lại nước cờ trước">
        <svg class="w-full h-full" viewBox="0 0 90 90" fill="none">
          <path d="M45 6 C63 4 80 16 83 34 C86 52 76 72 61 81 C46 90 26 86 14 74 C2 62 3 41 9 26 C15 11 27 8 45 6 Z" fill="#130e0b"/>
          <circle cx="45" cy="45" r="32" stroke="rgba(255, 252, 240, 0.85)" stroke-width="2.2" stroke-dasharray="22 7 14 8 26 5" fill="none"/>
          <text x="45" y="52" text-anchor="middle" font-size="22" font-family="'Ma Shan Zheng', serif" font-weight="900" fill="#fefdf9" letter-spacing="1">悔棋</text>
        </svg>
      </div>
    </div>

    <!-- Nút 3: PHÁT LẠI (HÌNH VẾT MỰC + VÒNG CỌ TRẮNG) -->
    <div class="transform translate-x-5">
      <div id="btn-restart" class="ink-btn w-20 h-20" title="Phát lại — Bắt đầu ván cờ mới">
        <svg class="w-full h-full" viewBox="0 0 90 90" fill="none">
          <path d="M44 7 C60 5 76 15 82 31 C88 47 81 67 69 77 C57 87 37 88 23 80 C9 72 4 54 7 38 C10 22 28 9 44 7 Z" fill="#130e0b"/>
          <circle cx="45" cy="45" r="32" stroke="rgba(255, 252, 240, 0.85)" stroke-width="2.2" stroke-dasharray="18 6 26 7 12 6" fill="none"/>
          <text x="45" y="52" text-anchor="middle" font-size="22" font-family="'Ma Shan Zheng', serif" font-weight="900" fill="#fefdf9" letter-spacing="1">重玩</text>
        </svg>
      </div>
    </div>

    <!-- Nút 4: KỲ PHỔ (MỞ KHO 26 THẾ CỜ & 4 TẦNG HUẤN LUYỆN) -->
    <div class="transform translate-x-2">
      <div id="btn-mastery" class="ink-btn w-20 h-20" title="Kỳ Phổ & Thế Cờ — Mở 26 thế cờ và 4 tầng bài học">
        <svg class="w-full h-full" viewBox="0 0 90 90" fill="none">
          <path d="M46 8 C64 6 79 19 82 37 C85 55 74 74 58 82 C42 90 22 84 12 70 C2 56 5 36 12 23 C19 10 28 10 46 8 Z" fill="#130e0b"/>
          <circle cx="45" cy="45" r="32" stroke="rgba(251, 191, 36, 0.85)" stroke-width="2.2" stroke-dasharray="20 6 16 8 24 6" fill="none"/>
          <text x="45" y="52" text-anchor="middle" font-size="22" font-family="'Ma Shan Zheng', serif" font-weight="900" fill="#fef08a" letter-spacing="1">棋譜</text>
        </svg>
      </div>
    </div>

  </div>

  <!-- FLOATING CARD KHI ĐANG LUYỆN THẾ CỜ -->
  <div id="lesson-card" class="fixed top-6 left-6 z-30 max-w-sm sm:max-w-md w-[90vw] bg-stone-950/92 border border-amber-500/60 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-amber-100 hidden flex-col gap-2.5 transition-all font-serif">
    <div class="flex items-center justify-between gap-2 border-b border-amber-500/30 pb-2">
      <span id="lesson-tier-badge" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-900/60 text-amber-300 border border-amber-500/40">Tầng 1 • Bài 1.1</span>
      <div class="flex items-center gap-1.5 font-sans">
        <button id="btn-prev-lesson" class="px-2 py-0.5 text-xs rounded bg-stone-800 hover:bg-stone-700 text-amber-200 cursor-pointer" title="Bài trước">◀ Trước</button>
        <button id="btn-next-lesson" class="px-2 py-0.5 text-xs rounded bg-stone-800 hover:bg-stone-700 text-amber-200 cursor-pointer" title="Bài sau">Sau ▶</button>
        <button id="btn-close-lesson" class="px-2 py-0.5 text-xs rounded bg-red-950 hover:bg-red-900 text-amber-200 border border-red-800 cursor-pointer" title="Đóng thế cờ, quay về Đấu tự do">✕ Thoát</button>
      </div>
    </div>
    <div>
      <h3 id="lesson-title" class="font-serif font-black text-amber-200 text-base leading-snug">Bài 1.1: Cản Chân Mã & Ngọa Tào 1 Nước</h3>
      <p id="lesson-objective" class="text-xs text-stone-300 mt-1.5 leading-relaxed bg-stone-900/85 p-2.5 rounded-lg border border-stone-800 font-serif">
        Mục tiêu bài cờ...
      </p>
    </div>
    <div id="hint-box" class="hidden text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-600/60 p-2.5 rounded-lg font-serif"></div>
    <div id="lesson-feedback-box" class="hidden text-xs text-amber-200 bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-lg font-serif"></div>
    <div class="flex items-center justify-between gap-2 pt-1 text-xs font-sans">
      <button id="btn-show-hint" class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-600 text-emerald-200 font-bold transition cursor-pointer">
        <span>💡 Manh Mối (<span id="hint-step-count">0</span>/3)</span>
      </button>
      <button id="btn-reset-lesson" class="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-200 font-bold transition cursor-pointer">
        <span>🔄 Đặt Lại Thế Này</span>
      </button>
    </div>
  </div>

  <!-- SLIDE-OUT MASTER ROADMAP DRAWER (KỲ PHỔ 4 TẦNG & 26 THẾ CỜ) -->
  <div id="mastery-drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden transition-opacity"></div>
  <div id="mastery-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-stone-950/95 border-l-2 border-amber-600/70 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col font-serif text-amber-100">
    <div class="p-4 border-b border-amber-600/40 bg-stone-900/90 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-amber-300 flex items-center gap-2">
          <span>📚</span> KỲ PHỔ & BÁCH BIẾN THẾ CỜ (4 TẦNG)
        </h2>
        <p class="text-xs text-amber-200/70 mt-0.5">Kho 26 bài học và thế cờ kinh điển từ Quất Trung Bí đến Tứ Đại Danh Cục</p>
      </div>
      <button id="btn-close-drawer" class="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-lg leading-none cursor-pointer">✕</button>
    </div>
    <div class="grid grid-cols-4 gap-1 p-2 bg-stone-900 border-b border-amber-900/50 text-xs font-sans">
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-amber-700 text-amber-100" data-tier="1">Tầng 1<br><span class="text-[10px] font-normal">Sát Cục 1</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="2">Tầng 2<br><span class="text-[10px] font-normal">10 Sát Pháp</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="3">Tầng 3<br><span class="text-[10px] font-normal">Khai Cuộc</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="4">Tầng 4<br><span class="text-[10px] font-normal">Danh Cục</span></button>
    </div>
    <div id="tier-intro-box" class="p-3 bg-amber-950/40 border-b border-amber-800/40 text-xs text-amber-200/90 font-serif"></div>
    <div id="lessons-list-container" class="flex-1 overflow-y-auto p-3 space-y-2.5"></div>
    <div class="p-3 border-t border-amber-800/50 bg-stone-900/90 flex items-center justify-between gap-2">
      <button id="btn-free-mode" class="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-200 text-xs font-bold text-center cursor-pointer">
        ↩️ Đấu Tự Do (32 Quân Tiêu Chuẩn)
      </button>
      <button id="btn-upload-model" class="py-2 px-4 rounded-xl bg-amber-800/80 hover:bg-amber-700 border border-amber-600 text-amber-100 text-xs font-bold cursor-pointer" title="Tải model 3D .glb / .gltf từ máy tính">
        📁 Nạp Model 3D (.glb)
      </button>
      <input type="file" id="model-file-input" accept=".glb,.gltf" class="hidden" />
    </div>
  </div>

  <!-- VICTORY CELEBRATION MODAL -->
  <div id="lesson-victory-banner" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-stone-950/95 border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-center hidden flex-col items-center gap-3">
    <span class="text-5xl">🏆</span>
    <h3 class="font-serif font-black text-2xl text-amber-300">PHÁ THẾ THÀNH CÔNG!</h3>
    <p id="lesson-victory-desc" class="text-sm text-stone-200 max-w-sm"></p>
    <div class="flex items-center gap-3 mt-2 font-sans">
      <button id="btn-next-after-win" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-sm cursor-pointer shadow-lg">
        Bài Tiếp Theo ▶
      </button>
      <button id="btn-close-victory" class="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-sm cursor-pointer">
        Xem Lại Sa Bàn
      </button>
    </div>
  </div>

  <!-- DRAG & DROP OVERLAY -->
  <div id="drop-overlay">
    <div class="text-5xl mb-3">⚔️</div>
    <h3 class="text-2xl font-bold text-amber-300 font-serif">Kéo Thả Mô Hình 3D Vào Sa Bàn</h3>
    <p class="text-sm text-amber-100 mt-2">Hỗ trợ định dạng .glb và .gltf để tùy biến nhân vật sống 3D</p>
  </div>

  <!-- MODEL PICKER MODAL -->
  <div id="model-picker-modal" class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm hidden items-center justify-center">
    <div class="bg-stone-900 border-2 border-amber-500 rounded-2xl p-6 max-w-md w-[90vw] text-center font-serif text-amber-100 shadow-2xl">
      <h3 class="text-lg font-bold text-amber-300 mb-2">Gán Mô Hình 3D Cho Quân Nào?</h3>
      <p id="model-filename-label" class="text-xs text-stone-400 mb-4 font-mono"></p>
      <div class="grid grid-cols-4 gap-2 mb-4 font-sans text-xs">
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="K">Tướng (K)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="A">Sĩ (A)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="E">Tượng (E)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="R">Xe (R)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="C">Pháo (C)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="H">Mã (H)</button>
        <button class="btn-assign-model p-2 rounded bg-stone-800 hover:bg-amber-700 font-bold" data-type="P">Tốt (P)</button>
        <button id="btn-cancel-model" class="p-2 rounded bg-red-950 hover:bg-red-900 text-rose-300 font-bold">Hủy</button>
      </div>
    </div>
  </div>

  <!-- MAIN THREE.JS 3D ENGINE MODULE -->
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    /**********************************************************************
     * MODULE 1: ROADMAP DATA
     **********************************************************************/
    const XIANGQI_MASTERY_DATA = ${JSON.stringify(masteryData, null, 2)};

    /**********************************************************************
     * MODULE 2: WEB AUDIO SYNTHESIZER (CỔ CẦM & KIẾM KHÍ)
     **********************************************************************/
    class XianxiaAudioEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
      }
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      playSelect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 1046.5].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = i === 2 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.025);
          gain.gain.setValueAtTime(0.12, now + i * 0.025);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24 + i * 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.025);
          osc.stop(now + 0.3);
        });
      }
      playMoveStep() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }
      playSwordQiShockwave() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [880, 1318.5, 1760].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.03);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.35, now + 0.4);
          gain.gain.setValueAtTime(0.14, now + idx * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.03);
          osc.stop(now + 0.44);
        });
      }
    }
    const audio = new XianxiaAudioEngine();

    /**********************************************************************
     * MODULE 3: XIANGQI ENGINE & FEN
     **********************************************************************/
    const INITIAL_FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR r - - 0 1';

    function parseFEN(fen) {
      const [rowsPart, turnPart] = fen.trim().split(/\s+/);
      const rows = rowsPart.split('/');
      const board = Array.from({ length: 10 }, () => Array(9).fill(null));
      const mapChar = { k: 'K', a: 'A', b: 'E', e: 'E', r: 'R', c: 'C', n: 'H', h: 'H', p: 'P' };
      for (let r = 0; r < 10; r++) {
        let c = 0;
        for (const ch of rows[r] || '') {
          if (/\\d/.test(ch)) c += parseInt(ch, 10);
          else {
            const side = ch === ch.toUpperCase() ? 'r' : 'b';
            const type = mapChar[ch.toLowerCase()] || 'P';
            board[r][c] = { type, side };
            c++;
          }
        }
      }
      return { board, turn: turnPart === 'b' ? 'b' : 'r' };
    }

    function cloneBoard(b) {
      return b.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    }

    function isInside(r, c) {
      return r >= 0 && r < 10 && c >= 0 && c < 9;
    }

    function isInsidePalace(r, c, side) {
      if (c < 3 || c > 5) return false;
      return side === 'r' ? r >= 7 && r <= 9 : r >= 0 && r <= 2;
    }

    function findKing(board, side) {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          const p = board[r][c];
          if (p && p.type === 'K' && p.side === side) return { r, c };
        }
      }
      return null;
    }

    function getPseudoMoves(board, r, c) {
      const p = board[r][c];
      if (!p) return [];
      const moves = [];
      const side = p.side;

      if (p.type === 'K') {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (isInsidePalace(nr, nc, side)) {
            const t = board[nr][nc];
            if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
          }
        });
        // Flying General (Chống Tướng)
        const oppKing = findKing(board, side === 'r' ? 'b' : 'r');
        if (oppKing && oppKing.c === c) {
          const minR = Math.min(r, oppKing.r) + 1;
          const maxR = Math.max(r, oppKing.r);
          let blocked = false;
          for (let midR = minR; midR < maxR; midR++) {
            if (board[midR][c]) { blocked = true; break; }
          }
          if (!blocked) moves.push({ from: { r, c }, to: { r: oppKing.r, c: oppKing.c }, piece: p, captured: board[oppKing.r][oppKing.c] });
        }
      } else if (p.type === 'A') {
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          if (isInsidePalace(nr, nc, side)) {
            const t = board[nr][nc];
            if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
          }
        });
      } else if (p.type === 'E') {
        [[2, 2], [2, -2], [-2, 2], [-2, -2]].forEach(([dr, dc]) => {
          const nr = r + dr, nc = c + dc;
          const eyeR = r + dr / 2, eyeC = c + dc / 2;
          const riverOk = side === 'r' ? nr >= 5 : nr <= 4;
          if (isInside(nr, nc) && riverOk && !board[eyeR][eyeC]) {
            const t = board[nr][nc];
            if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
          }
        });
      } else if (p.type === 'H') {
        const dirs = [
          { step: [-2, -1], block: [-1, 0] }, { step: [-2, 1], block: [-1, 0] },
          { step: [2, -1], block: [1, 0] }, { step: [2, 1], block: [1, 0] },
          { step: [-1, -2], block: [0, -1] }, { step: [1, -2], block: [0, -1] },
          { step: [-1, 2], block: [0, 1] }, { step: [1, 2], block: [0, 1] },
        ];
        dirs.forEach(({ step, block }) => {
          const nr = r + step[0], nc = c + step[1];
          const br = r + block[0], bc = c + block[1];
          if (isInside(nr, nc) && !board[br][bc]) {
            const t = board[nr][nc];
            if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
          }
        });
      } else if (p.type === 'R') {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
          let step = 1;
          while (true) {
            const nr = r + dr * step, nc = c + dc * step;
            if (!isInside(nr, nc)) break;
            const t = board[nr][nc];
            if (!t) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: null });
            else {
              if (t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
              break;
            }
            step++;
          }
        });
      } else if (p.type === 'C') {
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => {
          let step = 1;
          let screenFound = false;
          while (true) {
            const nr = r + dr * step, nc = c + dc * step;
            if (!isInside(nr, nc)) break;
            const t = board[nr][nc];
            if (!screenFound) {
              if (!t) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: null });
              else screenFound = true;
            } else {
              if (t) {
                if (t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c: nc }, piece: p, captured: t });
                break;
              }
            }
            step++;
          }
        });
      } else if (p.type === 'P') {
        const forward = side === 'r' ? -1 : 1;
        const crossedRiver = side === 'r' ? r <= 4 : r >= 5;
        const nr = r + forward;
        if (isInside(nr, c)) {
          const t = board[nr][c];
          if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r: nr, c }, piece: p, captured: t });
        }
        if (crossedRiver) {
          [-1, 1].forEach((dc) => {
            const nc = c + dc;
            if (isInside(r, nc)) {
              const t = board[r][nc];
              if (!t || t.side !== side) moves.push({ from: { r, c }, to: { r, c: nc }, piece: p, captured: t });
            }
          });
        }
      }
      return moves;
    }

    function isKingInCheck(board, side) {
      const kingCoord = findKing(board, side);
      if (!kingCoord) return true;
      const oppSide = side === 'r' ? 'b' : 'r';
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          const p = board[r][c];
          if (p && p.side === oppSide) {
            const moves = getPseudoMoves(board, r, c);
            if (moves.some((m) => m.to.r === kingCoord.r && m.to.c === kingCoord.c)) return true;
          }
        }
      }
      return false;
    }

    function getLegalMoves(board, r, c) {
      const pseudo = getPseudoMoves(board, r, c);
      const piece = board[r][c];
      if (!piece) return [];
      return pseudo.filter((m) => {
        const nb = cloneBoard(board);
        nb[m.to.r][m.to.c] = piece;
        nb[m.from.r][m.from.c] = null;
        return !isKingInCheck(nb, piece.side);
      });
    }

    function getAllLegalMoves(board, side) {
      const all = [];
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] && board[r][c].side === side) {
            all.push(...getLegalMoves(board, r, c));
          }
        }
      }
      return all;
    }

    function findBestAIMove(board, side) {
      const moves = getAllLegalMoves(board, side);
      if (moves.length === 0) return null;
      const values = { K: 1000, R: 90, C: 45, H: 40, E: 20, A: 20, P: 15 };
      moves.sort((a, b) => {
        const valA = a.captured ? values[a.captured.type] || 10 : 0;
        const valB = b.captured ? values[b.captured.type] || 10 : 0;
        return valB - valA + (Math.random() - 0.5) * 5;
      });
      return moves[0];
    }

    /**********************************************************************
     * MODULE 4: THREE.JS SCENE, 4K PROCEDURAL CHESSBOARD & LIGHTING
     **********************************************************************/
    const CELL_SIZE = 1.04;
    function gridToWorld(r, c) {
      return { x: (c - 4) * CELL_SIZE, z: (r - 4.5) * CELL_SIZE };
    }
    function worldToGrid(x, z) {
      const c = Math.round(x / CELL_SIZE + 4);
      const r = Math.round(z / CELL_SIZE + 4.5);
      if (r < 0 || r >= 10 || c < 0 || c >= 9) return null;
      return { r, c };
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xdcd5ca, 0.022);

    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
    // 55 degree isometric perspective
    camera.position.set(0, 14.8, 10.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const outlineEffect = new OutlineEffect(renderer, {
      defaultThickness: 0.0032,
      defaultColor: [0.08, 0.05, 0.03],
      defaultAlpha: 0.95,
      defaultKeepAlive: true,
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.target.set(0, 0, 0);

    // Warm Natural Illumination
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    sunLight.position.set(8, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -9;
    sunLight.shadow.camera.right = 9;
    sunLight.shadow.camera.top = 9;
    sunLight.shadow.camera.bottom = -9;
    sunLight.shadow.bias = -0.0006;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.85);
    fillLight.position.set(-8, 10, -10);
    scene.add(fillLight);

    /**********************************************************************
     * MODULE 5: 4096x4096 PROCEDURAL WOOD TEXTURE & CARVED SEAL SCRIPT
     **********************************************************************/
    function generate4KProceduralBoardTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 4096;
      canvas.height = 4096;
      const ctx = canvas.getContext('2d');

      // 1. VERTICAL WOOD PLANKS (GỖ GHÉP DỌC)
      const plankCount = 11;
      const plankW = canvas.width / plankCount;
      const plankBaseColors = [
        '#d89b5c', '#ce9052', '#d59758', '#ca8b4d',
        '#d99c5e', '#cf9153', '#d49657', '#cb8d4e',
        '#d89b5c', '#ce9052', '#d59758'
      ];

      for (let p = 0; p < plankCount; p++) {
        const px = p * plankW;
        ctx.fillStyle = plankBaseColors[p % plankBaseColors.length];
        ctx.fillRect(px, 0, plankW, canvas.height);

        // Natural Sandalwood Grain Lines
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 55, 20, 0.085)';
        ctx.lineWidth = 2.2;
        for (let g = 0; g < 45; g++) {
          ctx.beginPath();
          const gx = px + Math.random() * plankW;
          ctx.moveTo(gx, 0);
          const freq = 0.0015 + Math.random() * 0.002;
          const amp = 8 + Math.random() * 14;
          for (let y = 0; y <= canvas.height; y += 40) {
            const nx = gx + Math.sin(y * freq + g) * amp;
            ctx.lineTo(nx, y);
          }
          ctx.stroke();
        }
        ctx.restore();

        // Plank Seam (Mối ghép gỗ có bóng đổ nhẹ)
        if (p > 0) {
          ctx.strokeStyle = 'rgba(40, 20, 8, 0.45)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, canvas.height);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(255, 235, 195, 0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px + 2, 0);
          ctx.lineTo(px + 2, canvas.height);
          ctx.stroke();
        }
      }

      // Warm amber ambient overlay
      const grad = ctx.createRadialGradient(2048, 2048, 400, 2048, 2048, 2500);
      grad.addColorStop(0, 'rgba(255, 240, 200, 0.12)');
      grad.addColorStop(1, 'rgba(70, 35, 10, 0.22)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. CHESS GRID COORDINATES & INK LINES
      const marginX = 260;
      const marginY = 260;
      const gridW = canvas.width - 2 * marginX;
      const gridH = canvas.height - 2 * marginY;
      const stepX = gridW / 8;
      const stepY = gridH / 9;

      const toX = (c) => marginX + c * stepX;
      const toY = (r) => marginY + r * stepY;

      // Outer Board Double Border
      ctx.strokeStyle = '#150e08';
      ctx.lineWidth = 14;
      ctx.strokeRect(toX(0) - 28, toY(0) - 28, gridW + 56, gridH + 56);
      ctx.lineWidth = 5;
      ctx.strokeRect(toX(0) - 14, toY(0) - 14, gridW + 28, gridH + 28);

      // Grid Lines
      ctx.lineWidth = 9;
      ctx.strokeStyle = '#150e08';

      // 10 Horizontal Lines
      for (let r = 0; r < 10; r++) {
        ctx.beginPath();
        ctx.moveTo(toX(0), toY(r));
        ctx.lineTo(toX(8), toY(r));
        ctx.stroke();
      }

      // 9 Vertical Lines (Broken at river for interior 7 lines)
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

      // Nine Palace Diagonals (Cửu Cung)
      ctx.lineWidth = 8;
      [
        [3, 0, 5, 2], [5, 0, 3, 2],
        [3, 7, 5, 9], [5, 7, 3, 9]
      ].forEach(([c1, r1, c2, r2]) => {
        ctx.beginPath();
        ctx.moveTo(toX(c1), toY(r1));
        ctx.lineTo(toX(c2), toY(r2));
        ctx.stroke();
      });

      // 14 Star / Cross Fiducial Markers (Dấu Thập Định Vị)
      const drawCross = (r, c) => {
        const cx = toX(c);
        const cy = toY(r);
        const gap = 14;
        const len = 34;
        ctx.lineWidth = 7;
        const dirs = [];
        if (c > 0) dirs.push([-1, -1], [-1, 1]);
        if (c < 8) dirs.push([1, -1], [1, 1]);
        dirs.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.moveTo(cx + dx * gap, cy + dy * (gap + len));
          ctx.lineTo(cx + dx * gap, cy + dy * gap);
          ctx.lineTo(cx + dx * (gap + len), cy + dy * gap);
          ctx.stroke();
        });
      };
      [
        [2, 1], [2, 7], [7, 1], [7, 7],
        [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
        [6, 0], [6, 2], [6, 4], [6, 6], [6, 8]
      ].forEach(([r, c]) => drawCross(r, c));

      // 3. ANCIENT SEAL SCRIPT (CHỮ TRIỆN CỔ 小篆): "楚 河" & "漢 界"
      // Carved with hollow double-outline strokes into the wooden planks
      const riverCenterY = (toY(4) + toY(5)) / 2;

      function drawDoubleCarvedSealText(text, cx, cy) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 135px "Noto Serif SC", "Ma Shan Zheng", serif';

        // Outer Carve Shadow (rãnh khắc chìm)
        ctx.lineWidth = 14;
        ctx.strokeStyle = 'rgba(40, 22, 10, 0.85)';
        ctx.strokeText(text, cx, cy);

        // Inner Wood Bevel Highlight (gờ sáng viền gỗ)
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(255, 235, 195, 0.65)';
        ctx.strokeText(text, cx + 2, cy + 2);

        // Core Hollow Fill
        ctx.fillStyle = 'rgba(95, 50, 18, 0.88)';
        ctx.fillText(text, cx, cy);
        ctx.restore();
      }

      drawDoubleCarvedSealText('楚 河', toX(1.8), riverCenterY);
      drawDoubleCarvedSealText('漢 界', toX(6.2), riverCenterY);

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    const boardTopMat = new THREE.MeshStandardMaterial({
      map: generate4KProceduralBoardTexture(),
      roughness: 0.38,
      metalness: 0.05,
    });

    const boardFrameMat = new THREE.MeshStandardMaterial({
      color: 0x45230c,
      roughness: 0.48,
      metalness: 0.12,
    });

    const boardWidth = CELL_SIZE * 8 + 1.6;
    const boardDepth = CELL_SIZE * 9 + 1.6;
    const boardThick = 0.55;

    const boardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(boardWidth, boardThick, boardDepth),
      [boardFrameMat, boardFrameMat, boardTopMat, boardFrameMat, boardFrameMat, boardFrameMat]
    );
    boardMesh.position.y = -boardThick / 2;
    boardMesh.receiveShadow = true;
    scene.add(boardMesh);

    // Peach Blossom Petals Falling in 3D Space
    const petalCount = 70;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 22;
      petalPos[i * 3 + 1] = Math.random() * 12;
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));

    const petalCanvas = document.createElement('canvas');
    petalCanvas.width = 64;
    petalCanvas.height = 64;
    const pCtx = petalCanvas.getContext('2d');
    pCtx.fillStyle = '#f472b6';
    pCtx.beginPath();
    pCtx.ellipse(32, 32, 26, 15, Math.PI / 4, 0, Math.PI * 2);
    pCtx.fill();

    const petalParticles = new THREE.Points(
      petalGeo,
      new THREE.PointsMaterial({
        map: new THREE.CanvasTexture(petalCanvas),
        size: 0.28,
        transparent: true,
        alphaTest: 0.1,
        opacity: 0.85,
      })
    );
    scene.add(petalParticles);

    /**********************************************************************
     * MODULE 6: 3D LIVING UNITS (NO BROWN CYLINDERS, PROPORTIONAL MESHES)
     **********************************************************************/
    const unitsRoot = new THREE.Group();
    const indicatorsRoot = new THREE.Group();
    const vfxRoot = new THREE.Group();
    scene.add(unitsRoot, indicatorsRoot, vfxRoot);

    // Toon Shading Materials
    function makeToonMat(colorHex) {
      return new THREE.MeshToonMaterial({ color: colorHex });
    }

    const redRobeMat = makeToonMat(0xd32f2f);      // Chu sa vermilion
    const redGoldMat = makeToonMat(0xfbbf24);      // Gold imperial trim
    const redSilkMat = makeToonMat(0xef4444);

    const blueRobeMat = makeToonMat(0x2b6cb0);     // Cyan-blue royal
    const blueSilverMat = makeToonMat(0xe2e8f0);   // Silver trim
    const blueSilkMat = makeToonMat(0x38bdf8);

    const fleshMat = makeToonMat(0xfde68a);
    const hairMat = makeToonMat(0x1c1917);
    const silverIronMat = makeToonMat(0xd1d5db);
    const darkIronMat = makeToonMat(0x374151);
    const bronzeMat = makeToonMat(0xd97706);
    const woodMat = makeToonMat(0x78350f);
    const strawHatMat = makeToonMat(0xd4a359);

    const CUSTOM_GLTF_MODELS = {};
    const gltfLoader = new GLTFLoader();

    function buildLiving3DUnit(type, side) {
      const root = new THREE.Group();
      const isRed = side === 'r';
      const robeMat = isRed ? redRobeMat : blueRobeMat;
      const silkMat = isRed ? redSilkMat : blueSilkMat;
      const trimMat = isRed ? redGoldMat : blueSilverMat;

      // Orient unit facing toward the river
      const body = new THREE.Group();
      body.rotation.y = isRed ? Math.PI : 0;
      root.add(body);
      root.userData.bobGroup = body;

      // Check custom GLTF override
      if (CUSTOM_GLTF_MODELS[type]) {
        body.add(CUSTOM_GLTF_MODELS[type].clone());
        return root;
      }

      if (type === 'K') {
        /******************************************************************
         * 1. TƯỚNG (General):
         *    Red side: Seated on Grand Golden Dragon Throne facing river
         *    Blue side: Emperor in imperial robes standing majestically
         ******************************************************************/
        if (isRed) {
          // RED EMPEROR SEATED ON ORNATE GOLDEN DRAGON THRONE
          // Stepped Dais directly on the board (y = 0)
          const dais = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.58), redGoldMat);
          dais.position.set(0, 0.06, 0);
          body.add(dais);

          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.22, 0.46), redGoldMat);
          seat.position.set(0, 0.23, 0.02);
          body.add(seat);

          // Majestic Dragon Throne Backrest (High, scalloped top)
          const throneBack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.96, 0.12), redGoldMat);
          throneBack.position.set(0, 0.60, -0.2);
          body.add(throneBack);

          // Dragon Head Armrests
          [-0.29, 0.29].forEach((xPos) => {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.32, 0.44), redGoldMat);
            arm.position.set(xPos, 0.34, 0.02);
            body.add(arm);
            const dragonHead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), redGoldMat);
            dragonHead.position.set(xPos, 0.46, 0.24);
            body.add(dragonHead);
          });

          // Seated Emperor
          const seatedRobe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.34, 16), robeMat);
          seatedRobe.position.set(0, 0.38, 0.05);
          body.add(seatedRobe);

          const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.36, 16), robeMat);
          torso.position.set(0, 0.62, 0.03);
          body.add(torso);

          // Wide Flowing Sleeves
          [-0.24, 0.24].forEach((xPos) => {
            const sleeve = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.36, 12), silkMat);
            sleeve.position.set(xPos, 0.56, 0.08);
            sleeve.rotation.z = xPos > 0 ? -0.55 : 0.55;
            body.add(sleeve);
          });

          const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), fleshMat);
          head.position.set(0, 0.9, 0.03);
          body.add(head);

          // Imperial Crown (Mianguan)
          const crown = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.24), redGoldMat);
          crown.position.set(0, 1.05, 0.03);
          body.add(crown);
        } else {
          // BLUE EMPEROR (Standing majestically in imperial cyan/blue robes)
          const lowerRobe = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 0.62, 16), robeMat);
          lowerRobe.position.set(0, 0.31, 0);
          body.add(lowerRobe);

          const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.38, 16), robeMat);
          upperTorso.position.set(0, 0.66, 0);
          body.add(upperTorso);

          // Gold Dragon Chest Emblem
          const dragonEmblem = new THREE.Mesh(new THREE.CircleGeometry(0.11, 14), blueSilverMat);
          dragonEmblem.position.set(0, 0.72, 0.17);
          body.add(dragonEmblem);

          [-0.24, 0.24].forEach((xPos) => {
            const sleeve = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.44, 12), silkMat);
            sleeve.position.set(xPos, 0.58, 0.06);
            sleeve.rotation.z = xPos > 0 ? -0.4 : 0.4;
            body.add(sleeve);
          });

          const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), fleshMat);
          head.position.set(0, 0.94, 0);
          body.add(head);

          const crown = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.22), blueSilverMat);
          crown.position.set(0, 1.09, 0);
          body.add(crown);
        }
      } else if (type === 'A') {
        /******************************************************************
         * 2. SĨ (Advisor): Female sword cultivator & mystic dancer,
         *    slender figure, floating celestial silk ribbons, twin fans/daggers
         ******************************************************************/
        const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.62, 16), robeMat);
        skirt.position.set(0, 0.31, 0);
        body.add(skirt);

        const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 0.32, 14), trimMat);
        bodice.position.set(0, 0.62, 0);
        body.add(bodice);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 16), fleshMat);
        head.position.set(0, 0.86, 0);
        body.add(head);

        const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), hairMat);
        hairBun.position.set(0, 0.99, -0.02);
        body.add(hairBun);

        // Floating Celestial Silk Ribbon (Hỗn Thiên Lăng curling around)
        const ribbon = new THREE.Mesh(
          new THREE.TorusGeometry(0.34, 0.026, 10, 32, Math.PI * 1.4),
          silkMat
        );
        ribbon.position.set(0, 0.68, -0.04);
        ribbon.rotation.z = -Math.PI * 0.2;
        body.add(ribbon);

        // Twin Martial Fans / Daggers
        [-1, 1].forEach((dir) => {
          const fan = new THREE.Mesh(new THREE.CircleGeometry(0.18, 14, 0, Math.PI * 0.85), silkMat);
          fan.position.set(dir * 0.26, 0.62, 0.14);
          fan.rotation.y = dir * 0.35;
          fan.rotation.z = dir === 1 ? -0.4 : 1.2;
          body.add(fan);

          const dagger = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.36, 8), silverIronMat);
          dagger.position.set(dir * 0.24, 0.56, 0.16);
          dagger.rotation.z = dir * -0.45;
          body.add(dagger);
        });
      } else if (type === 'E') {
        /******************************************************************
         * 3. TƯỢNG (Elephant): Heavy-set ancient guardian general,
         *    massive wide layered robes, imposing stance
         ******************************************************************/
        const robeBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.40, 0.32, 18), robeMat);
        robeBottom.position.set(0, 0.16, 0);
        body.add(robeBottom);

        const robeMid = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.35, 0.32, 18), silkMat);
        robeMid.position.set(0, 0.42, 0);
        body.add(robeMid);

        const robeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.32, 0.28, 18), robeMat);
        robeTop.position.set(0, 0.64, 0);
        body.add(robeTop);

        // Wide Heavy Shoulder Pauldrons
        const pauldrons = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.22, 0.38), trimMat);
        pauldrons.position.set(0, 0.72, 0);
        body.add(pauldrons);

        [-0.34, 0.34].forEach((xPos) => {
          const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, 0.38, 12), robeMat);
          sleeve.position.set(xPos, 0.52, 0.08);
          sleeve.rotation.z = xPos > 0 ? -0.35 : 0.35;
          body.add(sleeve);
        });

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), fleshMat);
        head.position.set(0, 0.92, 0);
        body.add(head);

        const guardianHelm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.22), hairMat);
        guardianHelm.position.set(0, 1.07, 0);
        body.add(guardianHelm);
      } else if (type === 'R') {
        /******************************************************************
         * 4. XE (Chariot): Giant Ancient Chinese Siege Ballista (Sàng Tử Nỗ)
         *    Heavy wood chassis on 4 wheels with giant crossbow & spear-bolt
         ******************************************************************/
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.72), woodMat);
        chassis.position.set(0, 0.20, 0);
        body.add(chassis);

        // 4 Spoked Bronze War Wheels resting on y = 0
        [
          [-0.32, -0.22], [0.32, -0.22], [-0.32, 0.24], [0.32, 0.24]
        ].forEach(([wx, wz]) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16), bronzeMat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(wx, 0.16, wz);
          body.add(wheel);
        });

        // Giant Crossbow Launching Rail
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.76), darkIronMat);
        rail.position.set(0, 0.36, 0.04);
        body.add(rail);

        // Arched Metallic Bow Arms
        const bow = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.10, 0.14), silverIronMat);
        bow.position.set(0, 0.44, 0.20);
        body.add(bow);

        // Massive Forward-Pointing Spear-Bolt
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.048, 0.84, 8), redGoldMat);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(0, 0.46, 0.16);
        body.add(bolt);

        // Twin Faction Banners at Rear
        [-0.24, 0.24].forEach((bx) => {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.94, 8), woodMat);
          pole.position.set(bx, 0.62, -0.30);
          body.add(pole);
          const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.34), silkMat);
          flag.position.set(bx, 0.90, -0.19);
          body.add(flag);
        });
      } else if (type === 'C') {
        /******************************************************************
         * 5. PHÁO (Cannon): Muscular warrior in dynamic horse stance
         *    carrying massive silver bombard cannon on right shoulder
         ******************************************************************/
        // Wide Horse Stance Legs directly on board
        [-0.15, 0.15].forEach((lx) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.30, 12), robeMat);
          leg.position.set(lx, 0.15, 0);
          leg.rotation.z = lx > 0 ? -0.32 : 0.32;
          body.add(leg);
        });

        const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.16, 14), robeMat);
        waist.position.set(0, 0.32, 0);
        body.add(waist);

        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.16, 0.34, 14), fleshMat);
        chest.position.set(0, 0.52, 0);
        chest.rotation.x = 0.18;
        body.add(chest);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), fleshMat);
        head.position.set(-0.04, 0.76, 0.04);
        body.add(head);

        // Massive Silver Bombard Cannon Hefting on Right Shoulder
        const bombardGroup = new THREE.Group();
        bombardGroup.position.set(0.18, 0.68, 0.06);
        bombardGroup.rotation.x = -0.30;
        body.add(bombardGroup);

        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.78, 18), silverIronMat);
        barrel.rotation.x = Math.PI / 2;
        bombardGroup.add(barrel);

        [-0.24, 0, 0.24].forEach((rz) => {
          const band = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.024, 10, 20), bronzeMat);
          band.position.z = rz;
          bombardGroup.add(band);
        });
      } else if (type === 'H') {
        /******************************************************************
         * 6. MÃ (Horse): Xianxia cavalry riding a dynamic rearing warhorse,
         *    front hooves in mid-air, wielding a long dragon spear
         ******************************************************************/
        const rearing = new THREE.Group();
        rearing.position.set(0, 0.06, -0.06);
        rearing.rotation.x = -0.38; // Dynamic Rearing Pose!
        body.add(rearing);

        // Hind Legs on board
        [-0.11, 0.11].forEach((hx) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.048, 0.38, 10), trimMat);
          leg.position.set(hx, 0.14, -0.22);
          leg.rotation.x = 0.38;
          rearing.add(leg);
        });

        // Raised Front Legs in Air
        [-0.11, 0.11].forEach((fx) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.36, 10), trimMat);
          leg.position.set(fx, 0.40, 0.34);
          leg.rotation.x = -0.48;
          rearing.add(leg);
        });

        const horseBody = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.30, 0.66), trimMat);
        horseBody.position.set(0, 0.38, 0);
        rearing.add(horseBody);

        const horseNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.15, 0.40, 12), trimMat);
        horseNeck.position.set(0, 0.62, 0.26);
        horseNeck.rotation.x = 0.58;
        rearing.add(horseNeck);

        const horseHead = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.30), silverIronMat);
        horseHead.position.set(0, 0.78, 0.38);
        rearing.add(horseHead);

        // Rider
        const riderTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.40, 12), robeMat);
        riderTorso.position.set(0, 0.68, -0.02);
        riderTorso.rotation.x = 0.28;
        rearing.add(riderTorso);

        const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 12), fleshMat);
        riderHead.position.set(0, 0.94, 0.04);
        rearing.add(riderHead);

        const dragonSpear = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 1.28, 8), silverIronMat);
        dragonSpear.position.set(0.24, 0.72, 0.26);
        dragonSpear.rotation.x = 0.78;
        rearing.add(dragonSpear);
      } else {
        /******************************************************************
         * 7. TỐT (Soldier): Infantry soldier in conical hat (Đấu Lĩnh 斗笠),
         *    lunging forward with large curved broadsword (Dao)
         ******************************************************************/
        const lunge = new THREE.Group();
        lunge.rotation.x = 0.24; // Dynamic Forward Lunge Charge
        body.add(lunge);

        const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.20, 0.46, 14), robeMat);
        tunic.position.set(0, 0.28, 0);
        lunge.add(tunic);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.10, 12, 12), fleshMat);
        head.position.set(0, 0.58, 0);
        lunge.add(head);

        // Conical Straw/Iron Hat (Đấu Lĩnh 斗笠)
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.14, 18), strawHatMat);
        hat.position.set(0, 0.68, 0);
        lunge.add(hat);

        // Large Curved Broadsword (Liễu Diệp Đao)
        const sabreGroup = new THREE.Group();
        sabreGroup.position.set(0.22, 0.42, 0.16);
        sabreGroup.rotation.z = -0.52;
        sabreGroup.rotation.x = 0.38;
        lunge.add(sabreGroup);

        const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), woodMat);
        sabreGroup.add(hilt);

        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.58, 0.12), silverIronMat);
        blade.position.set(0, 0.38, 0.02);
        sabreGroup.add(blade);
      }

      root.traverse((c) => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
      return root;
    }

    /**********************************************************************
     * MODULE 7: VFX (GOLDEN GOD-RAYS, RADIAL RAYS, CAMERA SHAKE)
     **********************************************************************/
    // Selection Ring under chosen piece (Dual glowing ring on surface)
    const selectRingGroup = new THREE.Group();
    selectRingGroup.visible = false;
    scene.add(selectRingGroup);

    const innerSelectRing = new THREE.Mesh(
      new THREE.RingGeometry(0.38, 0.45, 32),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    innerSelectRing.rotation.x = -Math.PI / 2;
    innerSelectRing.position.y = 0.02;
    selectRingGroup.add(innerSelectRing);

    const outerSelectRing = new THREE.Mesh(
      new THREE.RingGeometry(0.48, 0.52, 32),
      new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    outerSelectRing.rotation.x = -Math.PI / 2;
    outerSelectRing.position.y = 0.02;
    selectRingGroup.add(outerSelectRing);

    function triggerGoldenCaptureGodRays(coord) {
      const { x, z } = gridToWorld(coord.r, coord.c);
      audio.playSwordQiShockwave();

      // 1. Camera Shake
      const origX = camera.position.x;
      const origZ = camera.position.z;
      gsap.to(camera.position, {
        x: origX + (Math.random() - 0.5) * 0.45,
        z: origZ + (Math.random() - 0.5) * 0.45,
        duration: 0.08,
        repeat: 3,
        yoyo: true,
        onComplete: () => camera.position.set(origX, camera.position.y, origZ),
      });

      // 2. Concentric Expanding Golden Shockwave Rings
      [0.02, 0.035].forEach((h, idx) => {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.1, 0.35, 36),
          new THREE.MeshBasicMaterial({
            color: idx === 0 ? 0xfef08a : 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
          })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, h, z);
        vfxRoot.add(ring);

        gsap.to(ring.scale, { x: 9.5, y: 9.5, z: 9.5, duration: 0.68 + idx * 0.1, ease: 'power2.out' });
        gsap.to(ring.material, {
          opacity: 0,
          duration: 0.68 + idx * 0.1,
          ease: 'power2.out',
          onComplete: () => vfxRoot.remove(ring),
        });
      });

      // 3. Radial Golden God-Rays (Long light rays bursting horizontally across the board)
      const rayCount = 20;
      for (let i = 0; i < rayCount; i++) {
        const rayLen = 5.5 + Math.random() * 3.5;
        const rayGeo = new THREE.PlaneGeometry(0.16, rayLen);
        const rayMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0xfffbeb : 0xfbbf24,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const ray = new THREE.Mesh(rayGeo, rayMat);
        const ang = (i / rayCount) * Math.PI * 2;
        ray.position.set(x, 0.06, z);
        ray.rotation.x = -Math.PI / 2;
        ray.rotation.z = ang;
        vfxRoot.add(ray);

        const pushDist = 2.2 + Math.random() * 2.0;
        gsap.to(ray.position, {
          x: x + Math.cos(ang) * pushDist,
          z: z + Math.sin(ang) * pushDist,
          duration: 0.58,
          ease: 'power3.out',
        });
        gsap.to(ray.scale, { x: 2.2, y: 1.4, duration: 0.58 });
        gsap.to(rayMat, {
          opacity: 0,
          duration: 0.58,
          onComplete: () => vfxRoot.remove(ray),
        });
      }
    }

    /**********************************************************************
     * MODULE 8: GAMEPLAY & LESSON CONTROLLER
     **********************************************************************/
    let boardState = parseFEN(INITIAL_FEN).board;
    let currentTurn = 'r';
    let selectedCoord = null;
    let currentLegalMoves = [];
    let moveHistory = [];
    let isAnimating = false;
    let vsAI = true;

    let activeLesson = null;
    let activeStepIndex = 0;
    let currentHintLevel = 0;
    let currentDrawerTier = 1;

    const unitMeshes = new Map();

    function renderBoardUnits(board) {
      // Clear existing
      while (unitsRoot.children.length > 0) unitsRoot.remove(unitsRoot.children[0]);
      while (indicatorsRoot.children.length > 0) indicatorsRoot.remove(indicatorsRoot.children[0]);
      unitMeshes.clear();
      selectRingGroup.visible = false;

      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 9; c++) {
          const p = board[r][c];
          if (p) {
            const unit = buildLiving3DUnit(p.type, p.side);
            const pos = gridToWorld(r, c);
            unit.position.set(pos.x, 0, pos.z);
            unit.userData = { isUnit: true, r, c, type: p.type, side: p.side };
            unitsRoot.add(unit);
            unitMeshes.set(\`\${r},\${c}\`, unit);
          }
        }
      }
    }

    function selectSquare(r, c) {
      if (isAnimating) return;

      if (selectedCoord) {
        const move = currentLegalMoves.find((m) => m.to.r === r && m.to.c === c);
        if (move) {
          executeMove(move);
          return;
        }
      }

      const p = boardState[r][c];
      if (p && p.side === currentTurn) {
        selectedCoord = { r, c };
        currentLegalMoves = getLegalMoves(boardState, r, c);
        audio.playSelect();

        const pos = gridToWorld(r, c);
        selectRingGroup.position.set(pos.x, 0, pos.z);
        selectRingGroup.visible = true;

        while (indicatorsRoot.children.length > 0) indicatorsRoot.remove(indicatorsRoot.children[0]);

        currentLegalMoves.forEach((m) => {
          const pt = gridToWorld(m.to.r, m.to.c);
          if (m.captured) {
            const targetRing = new THREE.Mesh(
              new THREE.RingGeometry(0.35, 0.44, 24),
              new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
            );
            targetRing.rotation.x = -Math.PI / 2;
            targetRing.position.set(pt.x, 0.03, pt.z);
            indicatorsRoot.add(targetRing);
          } else {
            const dot = new THREE.Mesh(
              new THREE.OctahedronGeometry(0.12, 0),
              new THREE.MeshBasicMaterial({ color: 0xfef08a })
            );
            dot.position.set(pt.x, 0.16, pt.z);
            indicatorsRoot.add(dot);
          }
        });
      } else {
        selectedCoord = null;
        currentLegalMoves = [];
        selectRingGroup.visible = false;
        while (indicatorsRoot.children.length > 0) indicatorsRoot.remove(indicatorsRoot.children[0]);
      }
    }

    function executeMove(move) {
      isAnimating = true;
      selectedCoord = null;
      currentLegalMoves = [];
      selectRingGroup.visible = false;
      while (indicatorsRoot.children.length > 0) indicatorsRoot.remove(indicatorsRoot.children[0]);

      const fromKey = \`\${move.from.r},\${move.from.c}\`;
      const toKey = \`\${move.to.r},\${move.to.c}\`;
      const mover = unitMeshes.get(fromKey);
      const target = unitMeshes.get(toKey);

      const start = gridToWorld(move.from.r, move.from.c);
      const end = gridToWorld(move.to.r, move.to.c);

      moveHistory.push({
        move,
        prevBoard: cloneBoard(boardState),
        prevTurn: currentTurn,
      });

      boardState[move.to.r][move.to.c] = move.piece;
      boardState[move.from.r][move.from.c] = null;

      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        duration: 0.42,
        ease: 'power2.inOut',
        onUpdate: () => {
          const t = proxy.t;
          if (mover) {
            const cx = start.x + (end.x - start.x) * t;
            const cz = start.z + (end.z - start.z) * t;
            const cy = 4 * 1.35 * t * (1 - t);
            mover.position.set(cx, cy, cz);
          }
        },
        onComplete: () => {
          if (mover) {
            mover.position.set(end.x, 0, end.z);
            mover.userData.r = move.to.r;
            mover.userData.c = move.to.c;
          }

          if (target && move.captured) {
            unitsRoot.remove(target);
            triggerGoldenCaptureGodRays(move.to);
          } else {
            audio.playMoveStep();
          }

          unitMeshes.delete(fromKey);
          if (mover) unitMeshes.set(toKey, mover);

          currentTurn = currentTurn === 'r' ? 'b' : 'r';

          if (isKingInCheck(boardState, currentTurn)) {
            const k = findKing(boardState, currentTurn);
            if (k) triggerGoldenCaptureGodRays(k);
            const vig = document.getElementById('check-vignette');
            const ban = document.getElementById('check-banner');
            vig.style.opacity = '1';
            gsap.fromTo(ban, { opacity: 0, scale: 0.4 }, {
              opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)',
              onComplete: () => {
                gsap.to(ban, { opacity: 0, scale: 1.3, delay: 0.8, duration: 0.35 });
                setTimeout(() => (vig.style.opacity = '0'), 850);
              }
            });
          }

          isAnimating = false;

          if (activeLesson) {
            handleLessonProgress(move);
          } else if (vsAI && currentTurn === 'b') {
            setTimeout(() => {
              const aiMove = findBestAIMove(boardState, 'b');
              if (aiMove) executeMove(aiMove);
            }, 450);
          }
        },
      });
    }

    function handleLessonProgress(move) {
      if (!activeLesson || !activeLesson.steps) return;
      const step = activeLesson.steps[activeStepIndex];
      if (!step) return;

      const ok =
        move.from.r === step.playerMove.from.r &&
        move.from.c === step.playerMove.from.c &&
        move.to.r === step.playerMove.to.r &&
        move.to.c === step.playerMove.to.c;

      const fb = document.getElementById('lesson-feedback-box');
      if (ok) {
        fb.textContent = '✨ Nước đi chuẩn (' + step.playerMove.notation + '): ' + step.playerMove.whyBest;
        fb.className = 'text-xs text-amber-200 bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-lg font-serif';
        fb.classList.remove('hidden');

        if (step.opponentReply) {
          setTimeout(() => {
            const oppFrom = step.opponentReply.from;
            const oppTo = step.opponentReply.to;
            const oppPiece = boardState[oppFrom.r][oppFrom.c];
            if (oppPiece) {
              executeMove({
                from: oppFrom,
                to: oppTo,
                piece: oppPiece,
                captured: boardState[oppTo.r][oppTo.c],
              });
            }
            activeStepIndex++;
          }, 500);
        } else {
          if (activeStepIndex + 1 >= activeLesson.steps.length) {
            triggerLessonVictory();
          } else {
            activeStepIndex++;
          }
        }
      } else {
        if (isKingInCheck(boardState, 'b') && getAllLegalMoves(boardState, 'b').length === 0) {
          triggerLessonVictory();
        } else {
          fb.textContent = '⚠️ Nước cờ chưa tối ưu trong thế này! ' + (activeLesson.hints[0] || 'Hãy thử lại hoặc xem manh mối!');
          fb.className = 'text-xs text-rose-300 bg-rose-950/80 border border-rose-600/60 p-2.5 rounded-lg font-serif';
          fb.classList.remove('hidden');
        }
      }
    }

    function triggerLessonVictory() {
      audio.playSwordQiShockwave();
      triggerGoldenCaptureGodRays({ r: 4, c: 4 });
      const vic = document.getElementById('lesson-victory-banner');
      document.getElementById('lesson-victory-desc').textContent = 'Bạn đã hoàn thành xuất sắc thế cờ: ' + activeLesson.title;
      vic.classList.remove('hidden');
      vic.classList.add('flex');
    }

    function loadLesson(lesson) {
      activeLesson = lesson;
      activeStepIndex = 0;
      currentHintLevel = 0;

      const parsed = parseFEN(lesson.initialFen);
      boardState = parsed.board;
      currentTurn = parsed.turn;
      moveHistory = [];
      renderBoardUnits(boardState);

      document.getElementById('lesson-tier-badge').textContent = 'Tầng ' + lesson.tier + ' • ' + lesson.id;
      document.getElementById('lesson-title').textContent = lesson.title;
      document.getElementById('lesson-objective').textContent = lesson.objective;
      document.getElementById('hint-step-count').textContent = '0';
      document.getElementById('hint-box').classList.add('hidden');
      document.getElementById('lesson-feedback-box').classList.add('hidden');

      const card = document.getElementById('lesson-card');
      card.classList.remove('hidden');
      card.classList.add('flex');

      closeDrawer();
    }

    function returnToFreeMatch() {
      activeLesson = null;
      activeStepIndex = 0;
      currentHintLevel = 0;
      boardState = parseFEN(INITIAL_FEN).board;
      currentTurn = 'r';
      moveHistory = [];
      renderBoardUnits(boardState);

      document.getElementById('lesson-card').classList.add('hidden');
      document.getElementById('lesson-victory-banner').classList.add('hidden');
      closeDrawer();
    }

    function openDrawer() {
      document.getElementById('mastery-drawer-backdrop').classList.remove('hidden');
      document.getElementById('mastery-drawer').classList.remove('translate-x-full');
      renderTierLessons(currentDrawerTier);
    }

    function closeDrawer() {
      document.getElementById('mastery-drawer-backdrop').classList.add('hidden');
      document.getElementById('mastery-drawer').classList.add('translate-x-full');
    }

    function renderTierLessons(tier) {
      currentDrawerTier = tier;
      document.querySelectorAll('.tier-tab-btn').forEach((btn) => {
        const t = parseInt(btn.getAttribute('data-tier'), 10);
        btn.className = t === tier
          ? 'tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-amber-700 text-amber-100 shadow-md'
          : 'tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200';
      });

      const meta = XIANGQI_MASTERY_DATA.tiers.find((t) => t.tier === tier) || XIANGQI_MASTERY_DATA.tiers[0];
      document.getElementById('tier-intro-box').innerHTML = '<span class="font-bold text-amber-300">' + meta.name + ':</span> ' + meta.goal;

      const list = XIANGQI_MASTERY_DATA.lessons.filter((l) => l.tier === tier);
      const container = document.getElementById('lessons-list-container');
      container.innerHTML = '';

      list.forEach((l) => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-stone-900/90 border border-amber-900/40 hover:border-amber-500/70 transition flex flex-col gap-2 shadow-md';
        card.innerHTML = \`
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">\${l.id}</span>
            <span class="text-xs text-amber-400/90 font-bold">+\${l.expReward || 50} EXP</span>
          </div>
          <div>
            <h4 class="font-bold text-amber-200 text-sm leading-snug">\${l.title}</h4>
            <p class="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed font-serif">\${l.objective}</p>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] text-stone-400 italic">\${l.subtitle || ''}</span>
            <button class="btn-select-lesson px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs cursor-pointer shadow transition">
              ⚔️ Bày Thế Lên Sa Bàn
            </button>
          </div>
        \`;
        card.querySelector('.btn-select-lesson').addEventListener('click', () => loadLesson(l));
        container.appendChild(card);
      });
    }

    /**********************************************************************
     * MODULE 9: DRAG & DROP 3D MODEL (.GLB / .GLTF) REPLACEMENT
     **********************************************************************/
    let pendingGltfScene = null;
    let pendingFileName = '';

    function handleGltfFile(file) {
      if (!file || (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf'))) return;
      pendingFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        gltfLoader.parse(e.target.result, '', (gltf) => {
          pendingGltfScene = gltf.scene;
          const lower = file.name.toLowerCase();
          let autoType = null;
          if (lower.includes('xe') || lower.includes('rook') || lower.includes('_r')) autoType = 'R';
          else if (lower.includes('phao') || lower.includes('cannon') || lower.includes('_c')) autoType = 'C';
          else if (lower.includes('ma') || lower.includes('horse') || lower.includes('knight') || lower.includes('_h')) autoType = 'H';
          else if (lower.includes('tuong_k') || lower.includes('general') || lower.includes('king') || lower.includes('_k')) autoType = 'K';
          else if (lower.includes('si') || lower.includes('advisor') || lower.includes('_a')) autoType = 'A';
          else if (lower.includes('tuong_e') || lower.includes('elephant') || lower.includes('bishop') || lower.includes('_e')) autoType = 'E';
          else if (lower.includes('tot') || lower.includes('pawn') || lower.includes('soldier') || lower.includes('_p')) autoType = 'P';

          if (autoType) {
            assignModelToType(autoType);
          } else {
            document.getElementById('model-filename-label').textContent = file.name;
            const modal = document.getElementById('model-picker-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
          }
        });
      };
      reader.readAsArrayBuffer(file);
    }

    function assignModelToType(type) {
      if (!pendingGltfScene) return;
      // Auto-scale to fit roughly 1 unit height
      const box = new THREE.Box3().setFromObject(pendingGltfScene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) {
        const scale = 1.0 / maxDim;
        pendingGltfScene.scale.set(scale, scale, scale);
      }
      CUSTOM_GLTF_MODELS[type] = pendingGltfScene;
      renderBoardUnits(boardState);
      document.getElementById('model-picker-modal').classList.add('hidden');
      document.getElementById('model-picker-modal').classList.remove('flex');
      pendingGltfScene = null;
    }

    // Drag & Drop Listeners
    const dropOverlay = document.getElementById('drop-overlay');
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropOverlay.style.display = 'flex';
    });
    window.addEventListener('dragleave', (e) => {
      if (e.target === dropOverlay) dropOverlay.style.display = 'none';
    });
    window.addEventListener('drop', (e) => {
      e.preventDefault();
      dropOverlay.style.display = 'none';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleGltfFile(e.dataTransfer.files[0]);
      }
    });

    document.querySelectorAll('.btn-assign-model').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        assignModelToType(type);
      });
    });
    document.getElementById('btn-cancel-model').addEventListener('click', () => {
      document.getElementById('model-picker-modal').classList.add('hidden');
      document.getElementById('model-picker-modal').classList.remove('flex');
      pendingGltfScene = null;
    });

    document.getElementById('btn-upload-model').addEventListener('click', () => {
      document.getElementById('model-file-input').click();
    });
    document.getElementById('model-file-input').addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleGltfFile(e.target.files[0]);
      }
    });

    /**********************************************************************
     * MODULE 10: RAYCASTING & EVENT HANDLERS
     **********************************************************************/
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.ink-btn') || e.target.closest('#mastery-drawer') || e.target.closest('#lesson-card') || e.target.closest('#lesson-victory-banner') || e.target.closest('#model-picker-modal')) return;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hit = raycaster.intersectObject(boardMesh, false);
      if (hit.length > 0) {
        const pt = hit[0].point;
        const grid = worldToGrid(pt.x, pt.z);
        if (grid) selectSquare(grid.r, grid.c);
      }
    });

    // Camera Switcher
    let camMode = 0;
    document.getElementById('btn-camera').addEventListener('click', () => {
      camMode = (camMode + 1) % 3;
      if (camMode === 0) {
        controls.enabled = true;
        gsap.to(camera.position, { x: 0, y: 14.8, z: 10.4, duration: 0.85, ease: 'power3.inOut', onUpdate: () => camera.lookAt(0, 0, 0) });
      } else if (camMode === 1) {
        controls.enabled = false;
        gsap.to(camera.position, { x: 0, y: 16.2, z: 0.15, duration: 0.85, ease: 'power3.inOut', onUpdate: () => camera.lookAt(0, 0, 0) });
      } else {
        controls.enabled = true;
      }
    });

    document.getElementById('btn-sound').addEventListener('click', (e) => {
      audio.muted = !audio.muted;
      e.currentTarget.style.opacity = audio.muted ? '0.45' : '1.0';
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
      if (moveHistory.length === 0 || isAnimating) return;
      const last = moveHistory.pop();
      boardState = last.prevBoard;
      currentTurn = last.prevTurn;
      renderBoardUnits(boardState);
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      boardState = parseFEN(INITIAL_FEN).board;
      currentTurn = 'r';
      moveHistory = [];
      renderBoardUnits(boardState);
      triggerGoldenCaptureGodRays({ r: 4, c: 4 });
    });

    document.getElementById('btn-mastery').addEventListener('click', openDrawer);
    document.getElementById('btn-close-drawer').addEventListener('click', closeDrawer);
    document.getElementById('mastery-drawer-backdrop').addEventListener('click', closeDrawer);
    document.getElementById('btn-free-mode').addEventListener('click', returnToFreeMatch);

    document.querySelectorAll('.tier-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = parseInt(btn.getAttribute('data-tier'), 10);
        renderTierLessons(tier);
      });
    });

    document.getElementById('btn-close-lesson').addEventListener('click', returnToFreeMatch);
    document.getElementById('btn-reset-lesson').addEventListener('click', () => {
      if (activeLesson) loadLesson(activeLesson);
    });

    document.getElementById('btn-show-hint').addEventListener('click', () => {
      if (!activeLesson || !activeLesson.hints) return;
      currentHintLevel = currentHintLevel < 3 ? currentHintLevel + 1 : 3;
      document.getElementById('hint-step-count').textContent = currentHintLevel;
      const box = document.getElementById('hint-box');
      box.textContent = '💡 Gợi ý ' + currentHintLevel + '/3: ' + activeLesson.hints[currentHintLevel - 1];
      box.classList.remove('hidden');
    });

    document.getElementById('btn-prev-lesson').addEventListener('click', () => {
      if (!activeLesson) return;
      const idx = XIANGQI_MASTERY_DATA.lessons.findIndex((l) => l.id === activeLesson.id);
      if (idx > 0) loadLesson(XIANGQI_MASTERY_DATA.lessons[idx - 1]);
    });

    document.getElementById('btn-next-lesson').addEventListener('click', () => {
      if (!activeLesson) return;
      const idx = XIANGQI_MASTERY_DATA.lessons.findIndex((l) => l.id === activeLesson.id);
      if (idx < XIANGQI_MASTERY_DATA.lessons.length - 1) loadLesson(XIANGQI_MASTERY_DATA.lessons[idx + 1]);
    });

    document.getElementById('btn-next-after-win').addEventListener('click', () => {
      document.getElementById('lesson-victory-banner').classList.add('hidden');
      if (activeLesson) {
        const idx = XIANGQI_MASTERY_DATA.lessons.findIndex((l) => l.id === activeLesson.id);
        if (idx < XIANGQI_MASTERY_DATA.lessons.length - 1) loadLesson(XIANGQI_MASTERY_DATA.lessons[idx + 1]);
        else openDrawer();
      }
    });

    document.getElementById('btn-close-victory').addEventListener('click', () => {
      document.getElementById('lesson-victory-banner').classList.add('hidden');
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      outlineEffect.setSize(window.innerWidth, window.innerHeight);
    });

    /**********************************************************************
     * MODULE 11: 60FPS ANIMATION LOOP
     **********************************************************************/
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (controls.enabled) controls.update();

      // Subtle breath animation for units
      unitsRoot.children.forEach((u, i) => {
        if (u.userData?.bobGroup) {
          u.userData.bobGroup.position.y = Math.sin(elapsed * 2.6 + i * 0.45) * 0.012;
        }
      });

      // Rotating selection ring
      if (selectRingGroup.visible) {
        innerSelectRing.rotation.z = elapsed * 1.5;
        outerSelectRing.rotation.z = -elapsed * 1.2;
      }

      // Rotating move indicators
      indicatorsRoot.children.forEach((orb) => {
        orb.rotation.y = elapsed * 2.5;
      });

      // Falling Peach Blossom Petals
      const posAttr = petalGeo.attributes.position;
      for (let i = 0; i < petalCount; i++) {
        let y = posAttr.getY(i) - 0.016;
        let x = posAttr.getX(i) + Math.sin(elapsed * 1.1 + i) * 0.008;
        let z = posAttr.getZ(i) + Math.cos(elapsed * 0.8 + i) * 0.005;
        if (y < -1.5) y = 10.5;
        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;

      // Render through Cel-Shaded OutlineEffect
      outlineEffect.render(scene, camera);
    }

    camera.lookAt(0, 0, 0);
    renderBoardUnits(boardState);
    animate();
  </script>
</body>
</html>
`;

// Write to public/xiangqi-3d.html
fs.writeFileSync(path.join(ROOT, 'public/xiangqi-3d.html'), htmlContent);
console.log('Successfully written upgraded public/xiangqi-3d.html! Size:', htmlContent.length);

// Write to Desktop
const desktopPath = '/Users/trankhanhtuong/Desktop/xiangqi-3d-masterpiece.html';
fs.writeFileSync(desktopPath, htmlContent);
console.log('Successfully written upgraded', desktopPath);
