/*
  Sea Turtle Cleanup - a simple arcade-style HTML5 Canvas game
  Controls: Arrow Keys / WASD
  Goal: Collect all unusual trash items to win
*/

(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const counterEl = document.getElementById('counter');
  const overlayEl = document.getElementById('overlay');
  const helpEl = document.getElementById('help');
  const btnReset = document.getElementById('btn-reset');
  const btnHelp = document.getElementById('btn-help');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const btnMute = document.getElementById('btn-mute');

  // Resize canvas to full screen with device pixel ratio for crisp art
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // Simple audio feedback
  const audioCtx = 'AudioContext' in window ? new AudioContext() : null;
  let isMuted = false;
  function playNote(freq = 520, ms = 120, type = 'sine', volume = 0.04) {
    if (!audioCtx || isMuted) return;
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    gain.gain.value = volume;
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + ms / 1000);
  }

  // Game constants
  const WORLD = { width: 3000, height: 1700 };
  const TURTLE = { speed: 2.4, accel: 0.22, drag: 0.90, size: 36 };
  const TRASH_COUNT = 26; // at least 24

  // Camera
  const camera = { x: 0, y: 0, width: 0, height: 0 };
  function updateCamera() {
    camera.width = canvas.clientWidth;
    camera.height = canvas.clientHeight;
    camera.x = clamp(player.x - camera.width / 2, 0, WORLD.width - camera.width);
    camera.y = clamp(player.y - camera.height / 2, 0, WORLD.height - camera.height);
  }

  // Input
  const keys = new Set();
  const keyMap = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
  };
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (keyMap[e.code]) keys.add(keyMap[e.code]);
    if (e.code === 'KeyR') reset();
    if (e.code === 'KeyH') toggleHelp(true);
    if (e.code === 'KeyM') toggleMute();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  });
  window.addEventListener('keyup', (e) => { if (keyMap[e.code]) keys.delete(keyMap[e.code]); });

  // Player state
  const player = {
    x: 200, y: 300, vx: 0, vy: 0,
    size: TURTLE.size,
    dir: 1, // 1 right, -1 left
    collected: 0,
  };

  // Generate decorative kelp and coral shapes for background
  const kelp = Array.from({ length: 80 }, () => ({
    x: rand(0, WORLD.width),
    y: rand(WORLD.height * 0.55, WORLD.height * 0.95),
    h: rand(60, 180),
    sway: rand(0, Math.PI * 2),
    hue: rand(160, 180),
  }));

  // Trash items
  const trashItems = [];
  const trashTypes = [
    { id: 'rubber_duck', color: '#ffd43b', accent: '#ff9ecd' },
    { id: 'old_gameboy', color: '#7af', accent: '#fff' },
    { id: 'vintage_sneaker', color: '#ff7a7a', accent: '#fff' },
    { id: 'cassette_tape', color: '#b5b5b5', accent: '#111' },
    { id: 'boombox', color: '#9fe', accent: '#123' },
    { id: 'party_hat', color: '#ff9ecd', accent: '#00ffd0' },
    { id: 'toy_robot', color: '#8cf', accent: '#004' },
    { id: 'neon_sunglasses', color: '#00ffd0', accent: '#012' },
    { id: 'skateboard', color: '#f4a261', accent: '#2a9d8f' },
    { id: 'comic_book', color: '#f72585', accent: '#fff' },
    { id: 'coin_stack', color: '#ffd166', accent: '#7a4' },
    { id: 'headphones', color: '#90caf9', accent: '#0d47a1' },
    { id: 'rubiks_cube', color: '#ff6b6b', accent: '#2b2b2b' },
    { id: 'neon_sign', color: '#39ffb6', accent: '#0a2a33' },
    { id: 'spray_can', color: '#b2ebf2', accent: '#006064' },
    { id: 'yo_yo', color: '#ff8fab', accent: '#ad1457' },
    { id: 'magic_wand', color: '#bb86fc', accent: '#3700b3' },
    { id: 'tiny_tv', color: '#00bcd4', accent: '#004d60' },
    { id: 'roller_boot', color: '#ffd1dc', accent: '#6a1b9a' },
    { id: 'smartwatch', color: '#bdbdbd', accent: '#000' },
    { id: 'toy_submarine', color: '#ffee58', accent: '#1976d2' },
    { id: 'mini_drone', color: '#a5d6a7', accent: '#1b5e20' },
    { id: 'glow_stick', color: '#7cffc4', accent: '#004d40' },
    { id: 'stickers_sheet', color: '#ffcc80', accent: '#5d4037' },
    { id: 'gamer_cap', color: '#64b5f6', accent: '#1e88e5' },
    { id: 'hologram_card', color: '#80deea', accent: '#3f51b5' },
  ];

  function generateTrash() {
    trashItems.length = 0;
    const padding = 140;
    for (let i = 0; i < TRASH_COUNT; i++) {
      const t = trashTypes[i % trashTypes.length];
      trashItems.push({
        id: `${t.id}_${i}`,
        type: t,
        x: rand(padding, WORLD.width - padding),
        y: rand(padding, WORLD.height - padding),
        r: rand(18, 24),
        collected: false,
        bob: rand(0, Math.PI * 2),
      });
    }
  }
  generateTrash();

  // Helpers
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function dist2(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return dx*dx + dy*dy; }

  function reset() {
    player.x = 200;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.collected = 0;
    for (const t of trashItems) t.collected = false;
    overlayEl.classList.add('hidden');
    updateCounter();
  }

  function updateCounter() {
    const total = trashItems.length;
    const collected = trashItems.filter(t => t.collected).length;
    counterEl.textContent = `${collected} / ${total}`;
  }

  function toggleHelp(show) {
    if (typeof show === 'boolean') {
      helpEl.classList.toggle('hidden', !show);
    } else {
      helpEl.classList.toggle('hidden');
    }
  }

  function toggleMute() {
    isMuted = !isMuted;
    btnMute.textContent = isMuted ? 'Unmute' : 'Mute';
  }

  // Drawing helpers - Iconic simple shapes with vibrant colors
  function drawBackground(ctx, time) {
    // Seafloor gradient and soft caustics
    const w = WORLD.width, h = WORLD.height;
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#07202a');
    gradient.addColorStop(0.6, '#08313d');
    gradient.addColorStop(1, '#06252d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Wavy light bands (caustics)
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#b6f9ff';
    for (let i = 0; i < 10; i++) {
      const y = (i / 10) * h;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 80) {
        const yy = y + Math.sin((x + time * 0.05 + i * 60) * 0.02) * 24;
        if (x === 0) ctx.moveTo(0, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Kelp
    ctx.save();
    for (const k of kelp) {
      const sway = Math.sin(time * 0.002 + k.sway) * 10;
      ctx.strokeStyle = `hsl(${k.hue}, 40%, 30%)`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(k.x, k.y);
      ctx.bezierCurveTo(k.x + sway, k.y - k.h * 0.3, k.x - sway, k.y - k.h * 0.6, k.x + sway * 0.6, k.y - k.h);
      ctx.stroke();
      // Leaves
      ctx.fillStyle = `hsl(${k.hue}, 50%, 35%)`;
      for (let j = 0; j < 5; j++) {
        const ly = k.y - (k.h * (j + 1)) / 6;
        const lx = k.x + Math.sin(time * 0.004 + j + k.sway) * 16;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 16, 8, Math.sin(j) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Bubbles
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#d7fbff';
    for (let i = 0; i < 80; i++) {
      const x = (i * 37.7 + time * 0.05) % w;
      const y = (i * 71.3 - time * 0.06) % h;
      const r = (i % 5) + 1.5;
      ctx.beginPath();
      ctx.arc(x, (y + h) % h, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTurtle(ctx, x, y, size, dir, time) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);

    // Body
    ctx.fillStyle = '#2bd4a1';
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.9, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shell pattern
    ctx.fillStyle = '#0f7e68';
    ctx.beginPath();
    ctx.ellipse(-2, 0, size * 0.7, size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#14b28d';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.ellipse(i * (size * 0.22), Math.sin(i + time * 0.01) * 2, size * 0.18, size * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Head
    ctx.fillStyle = '#2bd4a1';
    ctx.beginPath();
    ctx.ellipse(size * 0.95, -4, size * 0.35, size * 0.28, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Eye
    ctx.fillStyle = '#042c2c';
    ctx.beginPath();
    ctx.arc(size * 1.1, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Flippers
    const flap = Math.sin(time * 0.016) * 0.25;
    ctx.fillStyle = '#23c19b';
    // front
    ctx.save();
    ctx.translate(size * 0.2, size * 0.4);
    ctx.rotate(flap);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.45, size * 0.22, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // back
    ctx.save();
    ctx.translate(-size * 0.2, size * 0.35);
    ctx.rotate(-flap * 0.8);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.35, size * 0.18, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function drawTrash(ctx, t, time) {
    if (t.collected) return;
    const bob = Math.sin(time * 0.01 + t.bob) * 4;
    const x = t.x;
    const y = t.y + bob;
    // Glow
    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = t.type.accent;
    ctx.globalAlpha = 0.9;

    // Iconic simplified symbol per type
    ctx.fillStyle = t.type.color;
    ctx.strokeStyle = t.type.accent;
    ctx.lineWidth = 2;
    const r = t.r;
    switch (t.type.id) {
      case 'rubber_duck':
        ctx.beginPath();
        ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.9, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'old_gameboy':
        roundedRect(ctx, x - r, y - r * 1.1, r * 2, r * 2.2, 6);
        ctx.fill();
        ctx.fillStyle = '#063d3d';
        roundedRect(ctx, x - r * 0.7, y - r * 0.7, r * 1.4, r * 1, 4);
        ctx.fill();
        break;
      case 'vintage_sneaker':
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.5, 0.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'cassette_tape':
        roundedRect(ctx, x - r, y - r * 0.7, r * 2, r * 1.4, 6);
        ctx.fill();
        ctx.fillStyle = t.type.accent;
        ctx.beginPath();
        ctx.arc(x - r * 0.5, y, r * 0.25, 0, Math.PI * 2);
        ctx.arc(x + r * 0.5, y, r * 0.25, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'boombox':
        roundedRect(ctx, x - r * 1.1, y - r * 0.8, r * 2.2, r * 1.6, 8);
        ctx.fill();
        ctx.fillStyle = t.type.accent;
        ctx.beginPath();
        ctx.arc(x - r * 0.6, y, r * 0.35, 0, Math.PI * 2);
        ctx.arc(x + r * 0.6, y, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'party_hat':
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x - r * 0.8, y + r * 0.8);
        ctx.lineTo(x + r * 0.8, y + r * 0.8);
        ctx.closePath();
        ctx.fill();
        break;
      case 'toy_robot':
        roundedRect(ctx, x - r * 0.8, y - r * 0.8, r * 1.6, r * 1.6, 6);
        ctx.fill();
        ctx.fillStyle = t.type.accent;
        ctx.fillRect(x - r * 0.5, y - r * 0.2, r, r * 0.4);
        break;
      case 'neon_sunglasses':
        ctx.fillRect(x - r, y - r * 0.2, r * 0.8, r * 0.4);
        ctx.fillRect(x + r * 0.2, y - r * 0.2, r * 0.8, r * 0.4);
        break;
      case 'skateboard':
        roundedRect(ctx, x - r * 1.2, y - r * 0.3, r * 2.4, r * 0.6, 10);
        ctx.fill();
        break;
      case 'comic_book':
        roundedRect(ctx, x - r * 0.9, y - r * 1, r * 1.8, r * 2, 8);
        ctx.fill();
        break;
      case 'coin_stack':
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y - r * 0.5, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'headphones':
        ctx.beginPath();
        ctx.arc(x, y, r * 0.9, Math.PI, 0);
        ctx.lineWidth = 6;
        ctx.strokeStyle = t.type.color;
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.fillStyle = t.type.color;
        ctx.fillRect(x - r, y - r * 0.2, r * 0.5, r * 0.4);
        ctx.fillRect(x + r * 0.5, y - r * 0.2, r * 0.5, r * 0.4);
        break;
      case 'rubiks_cube':
        roundedRect(ctx, x - r, y - r, r * 2, r * 2, 4);
        ctx.fill();
        break;
      case 'neon_sign':
        roundedRect(ctx, x - r * 1.2, y - r * 0.8, r * 2.4, r * 1.6, 8);
        ctx.fill();
        break;
      case 'spray_can':
        roundedRect(ctx, x - r * 0.6, y - r, r * 1.2, r * 2, 6);
        ctx.fill();
        break;
      case 'yo_yo':
        ctx.beginPath();
        ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'magic_wand':
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.4);
        ctx.fillRect(-r * 0.9, -r * 0.07, r * 1.8, r * 0.14);
        ctx.restore();
        break;
      case 'tiny_tv':
        roundedRect(ctx, x - r, y - r * 0.8, r * 2, r * 1.6, 6);
        ctx.fill();
        break;
      case 'roller_boot':
        roundedRect(ctx, x - r, y - r * 0.5, r * 1.6, r, 6);
        ctx.fill();
        break;
      case 'smartwatch':
        roundedRect(ctx, x - r * 0.7, y - r * 0.9, r * 1.4, r * 1.8, 6);
        ctx.fill();
        break;
      case 'toy_submarine':
        roundedRect(ctx, x - r * 1.1, y - r * 0.6, r * 2.2, r * 1.2, 10);
        ctx.fill();
        break;
      case 'mini_drone':
        ctx.beginPath();
        ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'glow_stick':
        roundedRect(ctx, x - r * 0.15, y - r, r * 0.3, r * 2, 6);
        ctx.fill();
        break;
      case 'stickers_sheet':
        roundedRect(ctx, x - r * 0.9, y - r * 1.2, r * 1.8, r * 2.4, 6);
        ctx.fill();
        break;
      case 'gamer_cap':
        ctx.beginPath();
        ctx.arc(x, y, r * 0.8, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(x, y, r * 0.9, r * 0.2);
        break;
      case 'hologram_card':
        roundedRect(ctx, x - r, y - r * 0.7, r * 2, r * 1.4, 10);
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  }

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function collectCheck() {
    for (const t of trashItems) {
      if (t.collected) continue;
      const r = t.r + player.size * 0.5;
      if (dist2(player.x, player.y, t.x, t.y) < r * r) {
        t.collected = true;
        player.collected += 1;
        updateCounter();
        playNote(620, 80, 'sine', 0.05);
        playNote(880, 120, 'triangle', 0.04);
      }
    }
    if (trashItems.every(t => t.collected)) {
      overlayEl.classList.remove('hidden');
      playNote(520, 140, 'triangle', 0.06);
      playNote(660, 140, 'triangle', 0.06);
      playNote(820, 200, 'triangle', 0.06);
    }
  }

  // Main loop
  let last = 0;
  function tick(ts) {
    const dt = Math.min(33, ts - last);
    last = ts;
    const time = ts;

    // Physics
    const inputX = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
    const inputY = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);

    player.vx += inputX * TURTLE.accel;
    player.vy += inputY * TURTLE.accel;
    const speed = Math.hypot(player.vx, player.vy);
    const maxSpeed = TURTLE.speed;
    if (speed > maxSpeed) {
      player.vx = (player.vx / speed) * maxSpeed;
      player.vy = (player.vy / speed) * maxSpeed;
    }
    player.vx *= TURTLE.drag;
    player.vy *= TURTLE.drag;
    player.x = clamp(player.x + player.vx, 0, WORLD.width);
    player.y = clamp(player.y + player.vy, 0, WORLD.height);
    if (Math.abs(player.vx) > 0.01) player.dir = player.vx >= 0 ? 1 : -1;

    updateCamera();

    // Render world to an offscreen translation via camera
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    drawBackground(ctx, time);

    // Draw trash
    for (const t of trashItems) {
      if (t.x < camera.x - 80 || t.x > camera.x + camera.width + 80 ||
          t.y < camera.y - 80 || t.y > camera.y + camera.height + 80) continue;
      drawTrash(ctx, t, time);
    }

    // Draw turtle
    drawTurtle(ctx, player.x, player.y, player.size, player.dir, time);
    ctx.restore();

    collectCheck();

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // UI events
  btnReset.addEventListener('click', reset);
  btnHelp.addEventListener('click', () => toggleHelp(true));
  btnCloseHelp.addEventListener('click', () => toggleHelp(false));
  btnPlayAgain.addEventListener('click', () => { reset(); });
  btnMute.addEventListener('click', toggleMute);

  // Initial values
  updateCounter();
  toggleHelp(true);
})();


