import fs from 'fs';
import path from 'path';

const ROOT = '/Users/trankhanhtuong/.gemini/antigravity/scratch/xiangqi-mastery-system';
const masteryData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/masteryData.json'), 'utf8'));

let html = fs.readFileSync(path.join(ROOT, 'public/xiangqi-3d.html'), 'utf8');

// 1. Update the top status pill to add the "📚 Kỳ Phổ 4 Tầng & Thế Cờ" button
const oldTopPill = `<div class="fixed top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-1.5 rounded-full bg-stone-950/80 border border-amber-400/50 backdrop-blur-md text-xs text-amber-100 shadow-xl">
    <span id="turn-badge" class="font-bold text-amber-300 tracking-wide">🔴 Phe Đỏ (Chu Vũ) Tiên Thủ</span>
    <span class="text-amber-500/50">|</span>
    <button id="btn-toggle-ai" class="hover:text-amber-300 transition cursor-pointer font-semibold">🤖 Đấu AI: BẬT</button>
    <span class="text-amber-500/50">|</span>
    <button id="btn-piece-style" class="hover:text-amber-300 transition cursor-pointer font-semibold">⚔️ Hình Khối: Nhân Vật 3D</button>
  </div>`;

const newTopPill = `<div class="fixed top-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 rounded-full bg-stone-950/85 border border-amber-400/50 backdrop-blur-md text-xs text-amber-100 shadow-xl">
    <span id="turn-badge" class="font-bold text-amber-300 tracking-wide">🔴 Phe Đỏ (Chu Vũ) Tiên Thủ</span>
    <span class="text-amber-500/50">|</span>
    <button id="btn-top-mastery" class="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border border-amber-400/80 text-amber-200 font-bold transition cursor-pointer shadow-md" title="Mở danh sách 26 bài học và thế cờ 4 tầng">
      <span>📚 Kỳ Phổ 4 Tầng & Thế Cờ (26 Thế)</span>
    </button>
    <span class="text-amber-500/50">|</span>
    <button id="btn-toggle-ai" class="hover:text-amber-300 transition cursor-pointer font-semibold">🤖 Đấu AI: BẬT</button>
    <span class="text-amber-500/50">|</span>
    <button id="btn-piece-style" class="hover:text-amber-300 transition cursor-pointer font-semibold">⚔️ Hình Khối: Nhân Vật 3D</button>
  </div>`;

if (!html.includes(oldTopPill)) {
  console.error('Could not find oldTopPill');
} else {
  html = html.replace(oldTopPill, newTopPill);
}

// 2. Add the 4th ink button "棋譜 / Kỳ Phổ" to the right curved buttons cluster
const oldRightButtons = `  <!-- 5. HUD OVERLAY — BÊN PHẢI BÀN CỜ: 3 NÚT VẾT MỰC XẾP DỌC THEO ĐƯỜNG CONG NHẸ -->
  <div class="fixed right-[10%] sm:right-[15%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6">
    <!-- Nút 1: "Âm thanh" (Hình Hồ Lô Mực - Gourd-shaped Ink Blot) -->
    <div class="transform -translate-x-3">
      <button id="seal-sound" class="ink-blot-btn ink-gourd-btn" title="Bật / Tắt Âm thanh Cầm Khúc & Kiếm Khí">
        <div class="gourd-neck"></div>
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">声音</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Âm thanh</span>
      </button>
    </div>

    <!-- Nút 2: "Hối tiếc" (Đi lại - dịch nhẹ sang phải tạo đường cong) -->
    <div class="transform translate-x-2">
      <button id="seal-undo" class="ink-blot-btn" title="Hối tiếc — Đi lại nước cờ trước">
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">悔棋</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Hối tiếc</span>
      </button>
    </div>

    <!-- Nút 3: "Phát lại" (Chơi ván mới - lượn về bên phải theo đường cong) -->
    <div class="transform translate-x-5">
      <button id="seal-restart" class="ink-blot-btn" title="Phát lại — Bắt đầu ván cờ mới">
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">重玩</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Phát lại</span>
      </button>
    </div>
  </div>`;

const newRightButtons = `  <!-- 5. HUD OVERLAY — BÊN PHẢI BÀN CỜ: 4 NÚT VẾT MỰC XẾP DỌC THEO ĐƯỜNG CONG NHẸ -->
  <div class="fixed right-[10%] sm:right-[15%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-5">
    <!-- Nút 0: "Kỳ Phổ" (Mục Học Tập & Các Thế Cờ 4 Tầng) -->
    <div class="transform -translate-x-6">
      <button id="seal-mastery" class="ink-blot-btn" title="Kỳ Phổ & Thế Cờ — Mở kho 26 thế cờ và 4 tầng bài học">
        <span class="calligraphy-cn text-xl text-amber-200 leading-none">棋譜</span>
        <span class="calligraphy-vi text-xs text-amber-300 leading-none mt-0.5">Kỳ Phổ</span>
      </button>
    </div>

    <!-- Nút 1: "Âm thanh" (Hình Hồ Lô Mực - Gourd-shaped Ink Blot) -->
    <div class="transform -translate-x-3">
      <button id="seal-sound" class="ink-blot-btn ink-gourd-btn" title="Bật / Tắt Âm thanh Cầm Khúc & Kiếm Khí">
        <div class="gourd-neck"></div>
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">声音</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Âm thanh</span>
      </button>
    </div>

    <!-- Nút 2: "Hối tiếc" (Đi lại - dịch nhẹ sang phải tạo đường cong) -->
    <div class="transform translate-x-2">
      <button id="seal-undo" class="ink-blot-btn" title="Hối tiếc — Đi lại nước cờ trước">
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">悔棋</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Hối tiếc</span>
      </button>
    </div>

    <!-- Nút 3: "Phát lại" (Chơi ván mới - lượn về bên phải theo đường cong) -->
    <div class="transform translate-x-5">
      <button id="seal-restart" class="ink-blot-btn" title="Phát lại — Bắt đầu ván cờ mới">
        <span class="calligraphy-cn text-xl text-amber-100 leading-none">重玩</span>
        <span class="calligraphy-vi text-sm text-amber-200 leading-none mt-0.5">Phát lại</span>
      </button>
    </div>
  </div>

  <!-- ACTIVE LESSON FLOATING HUD CARD -->
  <div id="lesson-card" class="fixed top-14 left-4 z-30 max-w-sm sm:max-w-md w-[92vw] bg-stone-950/92 border border-amber-500/60 backdrop-blur-md rounded-2xl p-4 shadow-2xl text-amber-100 hidden flex-col gap-2.5 transition-all font-serif">
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

  <!-- SLIDE-OUT MASTER ROADMAP DRAWER -->
  <div id="mastery-drawer-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden transition-opacity"></div>
  <div id="mastery-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-stone-950/95 border-l-2 border-amber-600/70 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 flex flex-col font-serif text-amber-100">
    <!-- Header -->
    <div class="p-4 border-b border-amber-600/40 bg-stone-900/90 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-amber-300 flex items-center gap-2">
          <span>📚</span> KỲ PHỔ & BÁCH BIẾN THẾ CỜ (4 TẦNG)
        </h2>
        <p class="text-xs text-amber-200/70 mt-0.5">Kho 26 bài học và thế cờ kinh điển từ Quất Trung Bí đến Tứ Đại Danh Cục</p>
      </div>
      <button id="btn-close-drawer" class="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-lg leading-none cursor-pointer">✕</button>
    </div>
    <!-- Tier Tabs -->
    <div class="grid grid-cols-4 gap-1 p-2 bg-stone-900 border-b border-amber-900/50 text-xs font-sans">
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-amber-700 text-amber-100" data-tier="1">Tầng 1<br><span class="text-[10px] font-normal">Sát Cục 1</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="2">Tầng 2<br><span class="text-[10px] font-normal">10 Sát Pháp</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="3">Tầng 3<br><span class="text-[10px] font-normal">Khai Cuộc</span></button>
      <button class="tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200" data-tier="4">Tầng 4<br><span class="text-[10px] font-normal">Danh Cục</span></button>
    </div>
    <!-- Tier Intro Banner -->
    <div id="tier-intro-box" class="p-3 bg-amber-950/40 border-b border-amber-800/40 text-xs text-amber-200/90 font-serif">
    </div>
    <!-- Lessons List (Scrollable) -->
    <div id="lessons-list-container" class="flex-1 overflow-y-auto p-3 space-y-2.5">
    </div>
    <!-- Footer Action -->
    <div class="p-3 border-t border-amber-800/50 bg-stone-900/90 flex items-center justify-between gap-2">
      <button id="btn-free-mode" class="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-amber-200 text-xs font-bold text-center cursor-pointer">
        ↩️ Đấu Tự Do (32 Quân Tiêu Chuẩn)
      </button>
    </div>
  </div>

  <!-- GRAND LESSON VICTORY TOAST MODAL -->
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
  </div>`;

if (!html.includes(oldRightButtons)) {
  console.error('Could not find oldRightButtons');
} else {
  html = html.replace(oldRightButtons, newRightButtons);
}

// 3. Inject DATA & CONTROLLER LOGIC into JavaScript module
const targetModule8 = `    /**********************************************************************
     * MODULE 8: GAMEPLAY CONTROLLER & INTERACTION
     **********************************************************************/`;

const injectionModule8 = `    /**********************************************************************
     * MODULE 7.5: 26 MASTERY LESSONS & 4-TIER ROADMAP DATA
     **********************************************************************/
    const XIANGQI_MASTERY_DATA = ${JSON.stringify(masteryData, null, 2)};

    /**********************************************************************
     * MODULE 8: GAMEPLAY CONTROLLER & INTERACTION
     **********************************************************************/
    let activeLesson = null;
    let activeStepIndex = 0;
    let currentHintLevel = 0;
    let currentDrawerTier = 1;`;

if (!html.includes(targetModule8)) {
  console.error('Could not find targetModule8');
} else {
  html = html.replace(targetModule8, injectionModule8);
}

// 4. Update executeTroopMove to handle Lesson Steps and Opponent Reply
const targetExecuteTroopMoveEnd = `          if (vsAI && currentTurn === 'b') {
            setTimeout(() => {
              const aiMove = findBestAIMove(boardState, 'b');
              if (aiMove) executeTroopMove(aiMove);
            }, 460);
          }
        },
      });
    }`;

const newExecuteTroopMoveEnd = `          // LESSON STEP VERIFICATION OR FREE AI SPARRING
          if (activeLesson) {
            handleLessonMoveProgress(move);
          } else if (vsAI && currentTurn === 'b') {
            setTimeout(() => {
              const aiMove = findBestAIMove(boardState, 'b');
              if (aiMove) executeTroopMove(aiMove);
            }, 460);
          }
        },
      });
    }`;

if (!html.includes(targetExecuteTroopMoveEnd)) {
  console.error('Could not find targetExecuteTroopMoveEnd');
} else {
  html = html.replace(targetExecuteTroopMoveEnd, newExecuteTroopMoveEnd);
}

// 5. Append Lesson Controller Functions & Event Handlers before </script>
const targetEndOfScript = `    camera.lookAt(0, 0, 0);
    renderBoardUnits(boardState);
    setTimeout(() => selectSquare(7, 1), 300);
    animate();
  </script>`;

const lessonControllerScript = `    /**********************************************************************
     * MODULE 9: LESSON & ROADMAP INTERACTION CONTROLLER
     **********************************************************************/
    function showLessonFeedback(msg, isSuccess = true) {
      const fb = document.getElementById('lesson-feedback-box');
      fb.textContent = msg;
      fb.className = isSuccess
        ? 'text-xs text-amber-200 bg-amber-950/80 border border-amber-500/60 p-2.5 rounded-lg font-serif'
        : 'text-xs text-rose-300 bg-rose-950/80 border border-rose-600/60 p-2.5 rounded-lg font-serif';
      fb.classList.remove('hidden');
    }

    function handleLessonMoveProgress(move) {
      if (!activeLesson || !activeLesson.steps) return;
      const step = activeLesson.steps[activeStepIndex];
      if (!step) return;

      const isCorrect =
        move.from.r === step.playerMove.from.r &&
        move.from.c === step.playerMove.from.c &&
        move.to.r === step.playerMove.to.r &&
        move.to.c === step.playerMove.to.c;

      if (isCorrect) {
        audio.playSwordQiShockwave();
        showLessonFeedback('✨ ' + step.playerMove.notation + ': ' + step.playerMove.whyBest, true);

        if (step.opponentReply) {
          setTimeout(() => {
            const oppFrom = step.opponentReply.from;
            const oppTo = step.opponentReply.to;
            const oppPiece = boardState[oppFrom.r][oppFrom.c];
            if (oppPiece) {
              executeTroopMove({
                from: oppFrom,
                to: oppTo,
                piece: oppPiece,
                captured: boardState[oppTo.r][oppTo.c],
              });
            }
            activeStepIndex++;
          }, 500);
        } else {
          // Check if this was the last step
          if (activeStepIndex + 1 >= activeLesson.steps.length) {
            triggerLessonVictory();
          } else {
            activeStepIndex++;
          }
        }
      } else {
        // Check if player's alternate move delivered checkmate anyway
        if (isKingInCheck(boardState, 'b') && isCheckmateOrNoMoves(boardState, 'b')) {
          triggerLessonVictory();
        } else {
          showLessonFeedback('⚠️ Nước cờ chưa tối ưu trong thế này! ' + (activeLesson.hints[0] || 'Hãy thử lại hoặc xem gợi ý!'), false);
        }
      }
    }

    function triggerLessonVictory() {
      audio.playSwordQiShockwave();
      triggerSwordQiCaptureVFX({ r: 4, c: 4 });
      const vicModal = document.getElementById('lesson-victory-banner');
      const vicDesc = document.getElementById('lesson-victory-desc');
      vicDesc.textContent = 'Bạn đã hoàn thành xuất sắc thế cờ: ' + activeLesson.title + ' (+' + (activeLesson.expReward || 50) + ' EXP)';
      vicModal.classList.remove('hidden');
      vicModal.classList.add('flex');
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

      // Update Floating HUD Card
      document.getElementById('lesson-tier-badge').textContent = 'Tầng ' + lesson.tier + ' • ' + lesson.id;
      document.getElementById('lesson-title').textContent = lesson.title;
      document.getElementById('lesson-objective').textContent = lesson.objective;
      document.getElementById('hint-step-count').textContent = '0';
      document.getElementById('hint-box').classList.add('hidden');
      document.getElementById('lesson-feedback-box').classList.add('hidden');

      const card = document.getElementById('lesson-card');
      card.classList.remove('hidden');
      card.classList.add('flex');

      closeMasteryDrawer();
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
      closeMasteryDrawer();
      triggerSwordQiCaptureVFX({ r: 4, c: 4 });
    }

    function openMasteryDrawer() {
      document.getElementById('mastery-drawer-backdrop').classList.remove('hidden');
      document.getElementById('mastery-drawer').classList.remove('translate-x-full');
      renderTierLessons(currentDrawerTier);
    }

    function closeMasteryDrawer() {
      document.getElementById('mastery-drawer-backdrop').classList.add('hidden');
      document.getElementById('mastery-drawer').classList.add('translate-x-full');
    }

    function renderTierLessons(tier) {
      currentDrawerTier = tier;
      document.querySelectorAll('.tier-tab-btn').forEach((btn) => {
        const t = parseInt(btn.getAttribute('data-tier'), 10);
        if (t === tier) {
          btn.className = 'tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-amber-700 text-amber-100 shadow-md';
        } else {
          btn.className = 'tier-tab-btn py-2 px-1 text-center rounded-lg font-bold transition cursor-pointer bg-stone-800 text-stone-400 hover:text-amber-200';
        }
      });

      const tierMeta = XIANGQI_MASTERY_DATA.tiers.find((t) => t.tier === tier) || XIANGQI_MASTERY_DATA.tiers[0];
      const introBox = document.getElementById('tier-intro-box');
      introBox.innerHTML = '<span class=\"font-bold text-amber-300\">' + tierMeta.name + ' (' + tierMeta.period + '):</span> ' + tierMeta.goal;

      const lessons = XIANGQI_MASTERY_DATA.lessons.filter((l) => l.tier === tier);
      const container = document.getElementById('lessons-list-container');
      container.innerHTML = '';

      lessons.forEach((l) => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-stone-900/90 border border-amber-900/40 hover:border-amber-500/70 transition flex flex-col gap-2 shadow-md';
        const stars = '⭐'.repeat(l.difficulty || 1);
        card.innerHTML = \`
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">\${l.id} • \${stars}</span>
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
        card.querySelector('.btn-select-lesson').addEventListener('click', () => {
          loadLesson(l);
        });
        container.appendChild(card);
      });
    }

    // Attach Event Handlers
    document.getElementById('seal-mastery').addEventListener('click', openMasteryDrawer);
    document.getElementById('btn-top-mastery').addEventListener('click', openMasteryDrawer);
    document.getElementById('btn-close-drawer').addEventListener('click', closeMasteryDrawer);
    document.getElementById('mastery-drawer-backdrop').addEventListener('click', closeMasteryDrawer);
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
      const hintBox = document.getElementById('hint-box');
      hintBox.textContent = '💡 Gợi ý ' + currentHintLevel + '/3: ' + activeLesson.hints[currentHintLevel - 1];
      hintBox.classList.remove('hidden');
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
        if (idx < XIANGQI_MASTERY_DATA.lessons.length - 1) {
          loadLesson(XIANGQI_MASTERY_DATA.lessons[idx + 1]);
        } else {
          openMasteryDrawer();
        }
      }
    });

    document.getElementById('btn-close-victory').addEventListener('click', () => {
      document.getElementById('lesson-victory-banner').classList.add('hidden');
    });

` + targetEndOfScript;

if (!html.includes(targetEndOfScript)) {
  console.error('Could not find targetEndOfScript');
} else {
  html = html.replace(targetEndOfScript, lessonControllerScript);
}

// Write to public/xiangqi-3d.html
fs.writeFileSync(path.join(ROOT, 'public/xiangqi-3d.html'), html);
console.log('Successfully updated public/xiangqi-3d.html! Size:', html.length);

// Copy to Desktop
const desktopPath = '/Users/trankhanhtuong/Desktop/xiangqi-3d-masterpiece.html';
fs.writeFileSync(desktopPath, html);
console.log('Successfully updated', desktopPath);
