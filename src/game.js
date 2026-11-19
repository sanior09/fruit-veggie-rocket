(() => {
  const { sound } = window.FruitRocket;
  const {
    ITEM_TYPES,
    GOOD_KEYS,
    BAD_KEYS,
    drawItem,
    drawRocket,
    drawBullet,
    drawBackground,
  } = window.FruitRocket.sprites;

const GAME_DURATION = 60; // seconds
const FIRE_COOLDOWN = 0.19; // seconds between shots
const HOLD_FIRE_INTERVAL = 0.22;
const AUTO_FIRE_INTERVAL = 0.25;
const BEST_SCORE_KEY = 'fruit_veggie_rocket_best_v1';

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const stageWrap = canvas.parentElement;

const scorePill = document.getElementById('scorePill');
const scoreValueEl = document.getElementById('scoreValue');
const timerPill = document.getElementById('timerPill');
const timerValueEl = document.getElementById('timerValue');

const autoFireBtn = document.getElementById('autoFireBtn');
const soundBtn = document.getElementById('soundBtn');
const soundIconEl = document.getElementById('soundIcon');
const hudRestartBtn = document.getElementById('hudRestartBtn');

const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const finalScoreEl = document.getElementById('finalScore');
const bestScoreTagEl = document.getElementById('bestScoreTag');
const starsRowEl = document.getElementById('starsRow');
const rankMessageEl = document.getElementById('rankMessage');
const fruitsHitCountEl = document.getElementById('fruitsHitCount');
const junkHitCountEl = document.getElementById('junkHitCount');

// Game State
const state = {
  mode: 'start', // 'start' | 'playing' | 'gameover'
  width: 800,
  height: 600,
  dpr: 1,
  time: 0,

  score: 0,
  bestScore: Number(localStorage.getItem(BEST_SCORE_KEY) || 0),
  timeLeft: GAME_DURATION,
  lastWholeSecond: GAME_DURATION,
  fruitsHit: 0,
  junkHit: 0,

  autoFire: false,
  soundEnabled: true,

  rocket: {
    x: 400,
    targetX: 400,
    y: 540,
    tilt: 0,
    recoil: 0,
    scale: 1,
  },

  bullets: [],
  items: [],
  particles: [],
  popups: [],
  clouds: [],

  spawnTimer: 0,
  fireCooldown: 0,
  holdFireTimer: 0,
  shakeTimer: 0,

  pointerDown: false,
  keys: new Set(),
};

function initClouds() {
  state.clouds = Array.from({ length: 6 }, (_, i) => ({
    x: (state.width / 6) * i + Math.random() * 80,
    y: 45 + Math.random() * (state.height * 0.42),
    speed: 12 + Math.random() * 16,
    scale: 0.7 + Math.random() * 0.65,
  }));
}

function resizeCanvas() {
  const rect = stageWrap.getBoundingClientRect();
  const width = Math.max(300, Math.floor(rect.width));
  const height = Math.max(320, Math.floor(rect.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  state.width = width;
  state.height = height;
  state.dpr = dpr;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Responsive rocket size & bottom offset
  const baseScale = Math.max(0.78, Math.min(1.15, width / 650));
  state.rocket.scale = baseScale;
  state.rocket.y = height - Math.max(52, 58 * baseScale);
  state.rocket.x = clamp(state.rocket.x, 36, width - 36);
  state.rocket.targetX = clamp(state.rocket.targetX, 36, width - 36);

  if (state.clouds.length === 0) {
    initClouds();
  }
}

function renderLegendIcons() {
  const canvases = document.querySelectorAll('.legend-canvas');
  canvases.forEach((c) => {
    const type = c.dataset.item;
    if (!ITEM_TYPES[type]) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = 48;
    c.width = cssSize * dpr;
    c.height = cssSize * dpr;
    const lctx = c.getContext('2d');
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.translate(cssSize / 2, cssSize / 2);
    drawItem(lctx, type, 17, 0);
  });
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function updateHud() {
  scoreValueEl.textContent = String(state.score);
  const displaySec = Math.max(0, Math.ceil(state.timeLeft));
  timerValueEl.textContent = String(displaySec);

  if (state.mode === 'playing' && displaySec <= 10) {
    timerPill.classList.add('urgent');
  } else {
    timerPill.classList.remove('urgent');
  }
}

function pulseScorePill(isPositive) {
  scorePill.classList.remove('pop-up', 'pop-down');
  // Force reflow to replay animation cleanly
  void scorePill.offsetWidth;
  scorePill.classList.add(isPositive ? 'pop-up' : 'pop-down');
  clearTimeout(pulseScorePill._timer);
  pulseScorePill._timer = setTimeout(() => {
    scorePill.classList.remove('pop-up', 'pop-down');
  }, 220);
}

function startGame() {
  sound.unlock();
  sound.playStart();

  state.mode = 'playing';
  state.score = 0;
  state.timeLeft = GAME_DURATION;
  state.lastWholeSecond = GAME_DURATION;
  state.fruitsHit = 0;
  state.junkHit = 0;

  state.bullets = [];
  state.items = [];
  state.particles = [];
  state.popups = [];
  state.spawnTimer = 0.25;
  state.fireCooldown = 0;
  state.holdFireTimer = 0;
  state.shakeTimer = 0;

  state.rocket.x = state.width / 2;
  state.rocket.targetX = state.width / 2;
  state.rocket.tilt = 0;
  state.rocket.recoil = 0;

  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  hudRestartBtn.classList.remove('hidden');

  updateHud();
}

function endGame() {
  state.mode = 'gameover';
  state.pointerDown = false;
  sound.playGameOver();

  hudRestartBtn.classList.add('hidden');
  timerPill.classList.remove('urgent');

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    localStorage.setItem(BEST_SCORE_KEY, String(state.bestScore));
  }

  finalScoreEl.textContent = String(state.score);
  bestScoreTagEl.textContent = `สถิติสูงสุด: ${state.bestScore}`;
  fruitsHitCountEl.textContent = String(state.fruitsHit);
  junkHitCountEl.textContent = String(state.junkHit);

  // Kid-friendly encouragement & stars
  if (state.score >= 220) {
    starsRowEl.textContent = '⭐⭐⭐';
    rankMessageEl.textContent = 'สุดยอดนักบินอวกาศผักผลไม้! เก่งมากเลย!';
  } else if (state.score >= 120) {
    starsRowEl.textContent = '⭐⭐☆';
    rankMessageEl.textContent = 'เก่งมาก! ยิงผักผลไม้ได้เพียบเลย!';
  } else if (state.score >= 40) {
    starsRowEl.textContent = '⭐☆☆';
    rankMessageEl.textContent = 'ทำได้ดี! ลองหลบเค้กกับเบอร์เกอร์อีกนิดนะ!';
  } else {
    starsRowEl.textContent = '🌟';
    rankMessageEl.textContent = 'สู้ๆ นะ! มาลองยิงผักผลไม้อีกครั้งกันเถอะ!';
  }

  gameOverOverlay.classList.remove('hidden');
}

function shootBullet() {
  if (state.mode !== 'playing') return;
  if (state.fireCooldown > 0) return;

  state.fireCooldown = FIRE_COOLDOWN;
  state.rocket.recoil = 1;

  const noseOffset = 34 * state.rocket.scale;
  state.bullets.push({
    x: state.rocket.x,
    y: state.rocket.y - noseOffset,
    vy: -Math.max(540, state.height * 0.92),
    radius: Math.max(6, 7.5 * state.rocket.scale),
  });

  sound.playShoot();
}

function spawnItem() {
  // ~70% good fruits/veggies, ~30% junk food
  const isGood = Math.random() < 0.7;
  const pool = isGood ? GOOD_KEYS : BAD_KEYS;
  const type = pool[Math.floor(Math.random() * pool.length)];

  const baseRadius = clamp(state.width * 0.055, 24, 34);
  const margin = baseRadius + 16;
  const maxX = Math.max(margin + 1, state.width - margin);

  // Pick X trying to avoid spawning directly over another recent top item
  let x = margin + Math.random() * (maxX - margin);
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = margin + Math.random() * (maxX - margin);
    const tooClose = state.items.some(
      (it) => it.y < baseRadius * 3 && Math.abs(it.x - candidate) < baseRadius * 2.1
    );
    if (!tooClose) {
      x = candidate;
      break;
    }
  }

  // Gentle difficulty progression over the 60s round
  const progress = 1 - state.timeLeft / GAME_DURATION; // 0 -> 1
  const minSpeed = 105 + progress * 45;
  const maxSpeed = 175 + progress * 75;
  const heightFactor = clamp(state.height / 640, 0.85, 1.25);

  state.items.push({
    type,
    x,
    y: -baseRadius - 10,
    radius: baseRadius,
    vy: (minSpeed + Math.random() * (maxSpeed - minSpeed)) * heightFactor,
    vx: (Math.random() - 0.5) * 28,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 2 + Math.random() * 2,
    rot: 0,
  });
}

function createBurst(x, y, colors, count = 14) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 70 + Math.random() * 190;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      radius: 3.5 + Math.random() * 4.5,
      color: colors[i % colors.length],
      life: 0.45 + Math.random() * 0.25,
      maxLife: 0.7,
    });
  }
}

function createPopup(x, y, text, isPositive) {
  state.popups.push({
    x,
    y,
    text,
    color: isPositive ? '#16a34a' : '#dc2626',
    stroke: '#ffffff',
    vy: -65,
    life: 0.85,
    maxLife: 0.85,
  });
}

function update(dt) {
  state.time += dt;

  // Drift background clouds in all modes
  state.clouds.forEach((c) => {
    c.x += c.speed * dt;
    if (c.x - 50 * c.scale > state.width) {
      c.x = -50 * c.scale;
      c.y = 40 + Math.random() * (state.height * 0.42);
    }
  });

  if (state.mode !== 'playing') {
    // Gentle idle hover for rocket on Start screen
    if (state.mode === 'start') {
      state.rocket.x = state.width / 2 + Math.sin(state.time * 1.4) * Math.min(80, state.width * 0.14);
      state.rocket.tilt = Math.cos(state.time * 1.4) * 0.08;
    }
    return;
  }

  // Countdown timer
  state.timeLeft -= dt;
  const wholeSec = Math.max(0, Math.ceil(state.timeLeft));
  if (wholeSec !== state.lastWholeSecond) {
    state.lastWholeSecond = wholeSec;
    if (wholeSec <= 5 && wholeSec > 0) {
      sound.playTick();
    }
    updateHud();
  }

  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    updateHud();
    endGame();
    return;
  }

  // Keyboard steering
  const moveSpeed = Math.max(420, state.width * 0.75);
  if (state.keys.has('ArrowLeft') || state.keys.has('KeyA')) {
    state.rocket.targetX -= moveSpeed * dt;
  }
  if (state.keys.has('ArrowRight') || state.keys.has('KeyD')) {
    state.rocket.targetX += moveSpeed * dt;
  }

  const margin = 36 * state.rocket.scale;
  state.rocket.targetX = clamp(state.rocket.targetX, margin, state.width - margin);

  // Smooth rocket glide & tilt
  const prevX = state.rocket.x;
  const follow = 1 - Math.exp(-18 * dt);
  state.rocket.x += (state.rocket.targetX - state.rocket.x) * follow;
  const dx = (state.rocket.x - prevX) / Math.max(dt, 0.001);
  state.rocket.tilt = clamp(dx * 0.00045, -0.24, 0.24);
  state.rocket.recoil = Math.max(0, state.rocket.recoil - dt * 6);

  // Firing logic (cooldown + hold + auto-fire + Space/Up)
  state.fireCooldown = Math.max(0, state.fireCooldown - dt);

  const keyFire = state.keys.has('Space') || state.keys.has('ArrowUp') || state.keys.has('KeyW');
  if (keyFire) {
    shootBullet();
  } else if (state.pointerDown) {
    state.holdFireTimer -= dt;
    if (state.holdFireTimer <= 0) {
      shootBullet();
      state.holdFireTimer = HOLD_FIRE_INTERVAL;
    }
  } else if (state.autoFire) {
    state.holdFireTimer -= dt;
    if (state.holdFireTimer <= 0) {
      shootBullet();
      state.holdFireTimer = AUTO_FIRE_INTERVAL;
    }
  }

  // Spawn items
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnItem();
    const progress = 1 - state.timeLeft / GAME_DURATION;
    const minGap = 0.42 - progress * 0.14;
    const maxGap = 0.85 - progress * 0.25;
    state.spawnTimer = minGap + Math.random() * Math.max(0.12, maxGap - minGap);
  }

  // Update bullets
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const b = state.bullets[i];
    b.y += b.vy * dt;
    if (b.y < -30) {
      state.bullets.splice(i, 1);
    }
  }

  // Update falling items & check bullet collisions
  for (let i = state.items.length - 1; i >= 0; i--) {
    const item = state.items[i];
    item.y += item.vy * dt;
    item.x += item.vx * dt;
    item.wobblePhase += item.wobbleSpeed * dt;
    item.rot = Math.sin(item.wobblePhase) * 0.14;

    // Bounce gently off side walls
    const pad = item.radius + 8;
    if (item.x < pad) {
      item.x = pad;
      item.vx = Math.abs(item.vx);
    } else if (item.x > state.width - pad) {
      item.x = state.width - pad;
      item.vx = -Math.abs(item.vx);
    }

    // Remove if fallen past bottom
    if (item.y - item.radius > state.height + 20) {
      state.items.splice(i, 1);
      continue;
    }

    // Bullet collision check
    const info = ITEM_TYPES[item.type];
    const hitRadius = item.radius + (info.isGood ? 10 : 6);
    let hit = false;

    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const b = state.bullets[j];
      const distX = b.x - item.x;
      const distY = b.y - item.y;
      const distSq = distX * distX + distY * distY;
      const maxR = hitRadius + b.radius;

      if (distSq <= maxR * maxR) {
        state.bullets.splice(j, 1);
        hit = true;
        break;
      }
    }

    if (hit) {
      state.score += info.points;
      if (info.isGood) {
        state.fruitsHit += 1;
        sound.playGoodHit();
        createPopup(item.x, item.y - 10, '+10', true);
        pulseScorePill(true);
      } else {
        state.junkHit += 1;
        state.shakeTimer = 0.22;
        sound.playBadHit();
        createPopup(item.x, item.y - 10, '-10', false);
        pulseScorePill(false);
      }

      createBurst(item.x, item.y, info.particles, 14);
      updateHud();
      state.items.splice(i, 1);
    }
  }

  // Update particles
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 260 * dt; // subtle gravity
    p.life -= dt;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }

  // Update floating score popups
  for (let i = state.popups.length - 1; i >= 0; i--) {
    const pop = state.popups[i];
    pop.y += pop.vy * dt;
    pop.life -= dt;
    if (pop.life <= 0) {
      state.popups.splice(i, 1);
    }
  }

  if (state.shakeTimer > 0) {
    state.shakeTimer = Math.max(0, state.shakeTimer - dt);
  }
}

function render() {
  ctx.save();

  // Gentle screen shake on junk-food hit
  if (state.shakeTimer > 0) {
    const mag = (state.shakeTimer / 0.22) * 6;
    ctx.translate((Math.random() - 0.5) * mag * 2, (Math.random() - 0.5) * mag * 2);
  }

  drawBackground(ctx, state.width, state.height, state.clouds, state.time);

  // Bullets
  for (const b of state.bullets) {
    drawBullet(ctx, b.x, b.y, b.radius, state.time);
  }

  // Falling items
  for (const item of state.items) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rot);
    drawItem(ctx, item.type, item.radius, state.time);
    ctx.restore();
  }

  // Rocket
  drawRocket(
    ctx,
    state.rocket.x,
    state.rocket.y,
    state.rocket.scale,
    state.rocket.tilt,
    state.rocket.recoil,
    state.time
  );

  // Particles
  for (const p of state.particles) {
    const alpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (0.5 + alpha * 0.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Floating +10 / -10 popups
  for (const pop of state.popups) {
    const alpha = clamp(pop.life / pop.maxLife, 0, 1);
    const scale = 0.85 + (1 - alpha) * 0.35;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(pop.x, pop.y);
    ctx.scale(scale, scale);
    ctx.font = '700 28px Fredoka, Mali, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = pop.stroke;
    ctx.strokeText(pop.text, 0, 0);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

// Animation loop
let lastFrame = performance.now();
function loop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

// Pointer Controls (Mouse + Touch unified)
function getCanvasX(clientX) {
  const rect = canvas.getBoundingClientRect();
  return clientX - rect.left;
}

canvas.addEventListener('pointerdown', (e) => {
  if (state.mode !== 'playing') return;
  sound.unlock();
  canvas.setPointerCapture?.(e.pointerId);

  const margin = 36 * state.rocket.scale;
  state.rocket.targetX = clamp(getCanvasX(e.clientX), margin, state.width - margin);
  state.pointerDown = true;
  shootBullet();
  state.holdFireTimer = HOLD_FIRE_INTERVAL;
});

canvas.addEventListener('pointermove', (e) => {
  if (state.mode !== 'playing') return;
  const margin = 36 * state.rocket.scale;
  state.rocket.targetX = clamp(getCanvasX(e.clientX), margin, state.width - margin);
});

function releasePointer(e) {
  state.pointerDown = false;
  if (canvas.hasPointerCapture?.(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }
}

canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);

// Keyboard Controls
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
    if (state.mode === 'playing') {
      e.preventDefault();
    }
  }
  state.keys.add(e.code);
});

window.addEventListener('keyup', (e) => {
  state.keys.delete(e.code);
});

// UI Buttons
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
hudRestartBtn.addEventListener('click', startGame);

autoFireBtn.addEventListener('click', () => {
  sound.unlock();
  state.autoFire = !state.autoFire;
  autoFireBtn.setAttribute('aria-pressed', String(state.autoFire));
  const label = autoFireBtn.querySelector('.btn-text');
  if (label) {
    label.textContent = `ยิงอัตโนมัติ: ${state.autoFire ? 'เปิด' : 'ปิด'}`;
  }
});

soundBtn.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  sound.setEnabled(state.soundEnabled);
  soundBtn.setAttribute('aria-pressed', String(state.soundEnabled));
  soundIconEl.textContent = state.soundEnabled ? '🔊' : '🔇';
});

// Initialize
const ro = new ResizeObserver(resizeCanvas);
ro.observe(stageWrap);
resizeCanvas();
renderLegendIcons();
updateHud();
requestAnimationFrame(loop);
})();
