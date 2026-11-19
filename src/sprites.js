// Custom Canvas 2D Cartoon Sprites for "จรวดยิงผักผลไม้"
(() => {
  window.FruitRocket = window.FruitRocket || {};
  const INK = '#1e293b';

  const ITEM_TYPES = {
  apple: {
    id: 'apple',
    label: 'แอปเปิล',
    points: 10,
    isGood: true,
    particles: ['#ef4444', '#fca5a5', '#22c55e', '#fde047'],
  },
  banana: {
    id: 'banana',
    label: 'กล้วย',
    points: 10,
    isGood: true,
    particles: ['#fde047', '#fef08a', '#facc15', '#ffffff'],
  },
  carrot: {
    id: 'carrot',
    label: 'แครอท',
    points: 10,
    isGood: true,
    particles: ['#f97316', '#fdba74', '#22c55e', '#fde047'],
  },
  watermelon: {
    id: 'watermelon',
    label: 'แตงโม',
    points: 10,
    isGood: true,
    particles: ['#f43f5e', '#22c55e', '#fda4af', '#1e293b'],
  },
  orange: {
    id: 'orange',
    label: 'ส้ม',
    points: 10,
    isGood: true,
    particles: ['#fb923c', '#fed7aa', '#fde047', '#22c55e'],
  },
  cake: {
    id: 'cake',
    label: 'เค้ก',
    points: -10,
    isGood: false,
    particles: ['#f472b6', '#fbcfe8', '#fde047', '#ef4444'],
  },
  hamburger: {
    id: 'hamburger',
    label: 'แฮมเบอร์เกอร์',
    points: -10,
    isGood: false,
    particles: ['#f59e0b', '#78350f', '#ef4444', '#22c55e'],
  },
};

  const GOOD_KEYS = ['apple', 'banana', 'carrot', 'watermelon', 'orange'];
  const BAD_KEYS = ['cake', 'hamburger'];

function drawKawaiiFace(ctx, x, y, scale, moody = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Rosy cheeks
  ctx.fillStyle = moody ? 'rgba(239, 68, 68, 0.35)' : 'rgba(251, 113, 133, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-10, 3, 4.2, 2.6, 0, 0, Math.PI * 2);
  ctx.ellipse(10, 3, 4.2, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = INK;
  if (moody) {
    // Cheeky/dizzy > < or mischievous eyes for junk food
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = INK;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(-5, -1);
    ctx.lineTo(-9, 1);
    ctx.moveTo(9, -4);
    ctx.lineTo(5, -1);
    ctx.lineTo(9, 1);
    ctx.stroke();

    // Wavy grin
    ctx.beginPath();
    ctx.moveTo(-4, 5);
    ctx.quadraticCurveTo(0, 2, 4, 5);
    ctx.stroke();
  } else {
    // Big shiny cartoon eyes
    ctx.beginPath();
    ctx.arc(-6.5, -2, 2.8, 0, Math.PI * 2);
    ctx.arc(6.5, -2, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Eye sparkles
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7.3, -3, 1.05, 0, Math.PI * 2);
    ctx.arc(5.7, -3, 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Cute smile
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 1.5, 3.6, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}

function drawItem(ctx, type, radius, time = 0) {
  const s = radius / 30;
  ctx.save();
  ctx.scale(s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Subtle warning dashed ring on junk food so kids can distinguish quickly
  if (!ITEM_TYPES[type].isGood) {
    ctx.save();
    ctx.rotate(time * 0.8);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  switch (type) {
    case 'apple': {
      // Leaf
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(2, -19);
      ctx.quadraticCurveTo(16, -29, 17, -15);
      ctx.quadraticCurveTo(8, -11, 2, -19);
      ctx.fill();
      ctx.stroke();

      // Stem
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.quadraticCurveTo(-2, -25, 3, -27);
      ctx.stroke();

      // Apple body
      const grad = ctx.createRadialGradient(-7, -8, 4, 0, 2, 28);
      grad.addColorStop(0, '#ff6b6b');
      grad.addColorStop(0.6, '#ef4444');
      grad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = grad;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.bezierCurveTo(16, -24, 27, -6, 20, 14);
      ctx.bezierCurveTo(15, 24, 5, 24, 0, 20);
      ctx.bezierCurveTo(-5, 24, -15, 24, -20, 14);
      ctx.bezierCurveTo(-27, -6, -16, -24, 0, -15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gloss highlight
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.ellipse(-11, -7, 4, 7.5, 0.35, 0, Math.PI * 2);
      ctx.fill();

      drawKawaiiFace(ctx, 0, 3, 0.95);
      break;
    }

    case 'banana': {
      ctx.save();
      ctx.rotate(-0.2);

      const grad = ctx.createLinearGradient(-18, -22, 18, 22);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.55, '#fde047');
      grad.addColorStop(1, '#eab308');

      ctx.fillStyle = grad;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-16, -22);
      ctx.bezierCurveTo(18, -16, 26, 12, 12, 24);
      ctx.bezierCurveTo(6, 26, 2, 22, 4, 17);
      ctx.bezierCurveTo(10, 4, 4, -10, -16, -14);
      ctx.bezierCurveTo(-20, -16, -20, -21, -16, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Brown tips
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(-16.5, -18, 3, 0, Math.PI * 2);
      ctx.arc(10, 22.5, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Shine
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, -15);
      ctx.quadraticCurveTo(10, -7, 13, 10);
      ctx.stroke();

      drawKawaiiFace(ctx, 5, 1, 0.72);
      ctx.restore();
      break;
    }

    case 'carrot': {
      // Leafy green crown
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      const leaves = [-0.45, 0, 0.45];
      leaves.forEach((ang) => {
        ctx.save();
        ctx.translate(0, -15);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -8, 4.5, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Orange tapered carrot body
      const grad = ctx.createLinearGradient(-14, -14, 14, 24);
      grad.addColorStop(0, '#fb923c');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-15, -12);
      ctx.quadraticCurveTo(0, -19, 15, -12);
      ctx.quadraticCurveTo(16, 4, 3, 25);
      ctx.quadraticCurveTo(0, 28, -3, 25);
      ctx.quadraticCurveTo(-16, 4, -15, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Carrot texture grooves
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(-4, -4);
      ctx.moveTo(5, 8);
      ctx.lineTo(10, 8);
      ctx.stroke();

      drawKawaiiFace(ctx, 0, -1, 0.85);
      break;
    }

    case 'watermelon': {
      // Cute juicy wedge slice
      ctx.save();
      ctx.translate(0, -2);

      // Green rind
      ctx.fillStyle = '#16a34a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, -6, 25, 0.12 * Math.PI, 0.88 * Math.PI);
      ctx.lineTo(0, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Light green inner rim
      ctx.fillStyle = '#bbf7d0';
      ctx.beginPath();
      ctx.arc(0, -6, 21, 0.13 * Math.PI, 0.87 * Math.PI);
      ctx.lineTo(0, -16);
      ctx.closePath();
      ctx.fill();

      // Sweet red flesh
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(0, -6, 18.5, 0.14 * Math.PI, 0.86 * Math.PI);
      ctx.lineTo(0, -16);
      ctx.closePath();
      ctx.fill();

      // Seeds
      ctx.fillStyle = INK;
      const seeds = [[-9, 3], [9, 3], [0, 9]];
      seeds.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 1.5, 2.3, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      drawKawaiiFace(ctx, 0, -2, 0.78);
      ctx.restore();
      break;
    }

    case 'orange': {
      // Small leaf
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(7, -21, 7, 3.8, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Orange sphere
      const grad = ctx.createRadialGradient(-7, -8, 4, 0, 2, 25);
      grad.addColorStop(0, '#fed7aa');
      grad.addColorStop(0.35, '#fb923c');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.arc(0, 1, 21.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Citrus dimples
      ctx.fillStyle = 'rgba(194, 65, 12, 0.35)';
      ctx.beginPath();
      ctx.arc(-12, 8, 1.4, 0, Math.PI * 2);
      ctx.arc(13, -7, 1.4, 0, Math.PI * 2);
      ctx.arc(10, 11, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.ellipse(-9, -8, 4.5, 3, -0.5, 0, Math.PI * 2);
      ctx.fill();

      drawKawaiiFace(ctx, 0, 2, 0.92);
      break;
    }

    case 'cake': {
      // Cute strawberry cupcake / cake
      // Cupcake wrapper
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-17, 1);
      ctx.lineTo(17, 1);
      ctx.lineTo(13, 21);
      ctx.quadraticCurveTo(0, 24, -13, 21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Wrapper stripes
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-7, 3);
      ctx.lineTo(-5, 20);
      ctx.moveTo(7, 3);
      ctx.lineTo(5, 20);
      ctx.stroke();

      // Pink frosting swirl
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(-20, 2);
      ctx.bezierCurveTo(-24, -10, -10, -18, 0, -17);
      ctx.bezierCurveTo(10, -18, 24, -10, 20, 2);
      ctx.quadraticCurveTo(12, 7, 6, 3);
      ctx.quadraticCurveTo(0, 8, -6, 3);
      ctx.quadraticCurveTo(-12, 7, -20, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cherry on top
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -19, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      drawKawaiiFace(ctx, 0, 10, 0.78, true);
      break;
    }

    case 'hamburger': {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;

      // Bottom bun
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-20, 8, 40, 11, [4, 4, 10, 10]);
      ctx.fill();
      ctx.stroke();

      // Beef patty
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(-22, 1, 44, 9, 5);
      ctx.fill();
      ctx.stroke();

      // Melted cheese triangle
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(-16, 1);
      ctx.lineTo(16, 1);
      ctx.lineTo(4, 10);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lettuce wave
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.quadraticCurveTo(-15, -5, -8, 0);
      ctx.quadraticCurveTo(0, 4, 8, 0);
      ctx.quadraticCurveTo(15, -5, 22, 0);
      ctx.lineTo(20, 3);
      ctx.lineTo(-20, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top sesame bun
      const bunGrad = ctx.createLinearGradient(0, -20, 0, 0);
      bunGrad.addColorStop(0, '#fbbf24');
      bunGrad.addColorStop(1, '#d97706');
      ctx.fillStyle = bunGrad;
      ctx.beginPath();
      ctx.arc(0, -2, 20, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sesame seeds
      ctx.fillStyle = '#fef3c7';
      [[-8, -14], [0, -16], [9, -13]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.ellipse(sx, sy, 2, 1.1, 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      drawKawaiiFace(ctx, 0, -7, 0.78, true);
      break;
    }
  }

  ctx.restore();
}

function drawRocket(ctx, x, y, scale, tilt, recoil, time) {
  ctx.save();
  ctx.translate(x, y + recoil * 6);
  ctx.rotate(tilt);
  ctx.scale(scale * (1 + recoil * 0.08), scale * (1 - recoil * 0.1));
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Animated thruster flame
  const flicker = Math.sin(time * 28) * 4 + Math.cos(time * 19) * 2.5;
  ctx.fillStyle = '#f97316';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-11, 24);
  ctx.quadraticCurveTo(0, 46 + flicker, 11, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-6, 24);
  ctx.quadraticCurveTo(0, 38 + flicker * 0.6, 6, 24);
  ctx.closePath();
  ctx.fill();

  // Left & Right Fins
  ctx.fillStyle = '#ef4444';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.8;

  ctx.beginPath();
  ctx.moveTo(-16, 4);
  ctx.quadraticCurveTo(-30, 14, -27, 27);
  ctx.lineTo(-14, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(16, 4);
  ctx.quadraticCurveTo(30, 14, 27, 27);
  ctx.lineTo(14, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Thruster nozzle
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.roundRect(-11, 20, 22, 7, 3);
  ctx.fill();
  ctx.stroke();

  // Main rocket body
  const bodyGrad = ctx.createLinearGradient(-18, 0, 18, 0);
  bodyGrad.addColorStop(0, '#f8fafc');
  bodyGrad.addColorStop(0.65, '#ffffff');
  bodyGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.bezierCurveTo(18, -18, 19, 8, 15, 22);
  ctx.lineTo(-15, 22);
  ctx.bezierCurveTo(-19, 8, -18, -18, 0, -34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Red nose cone
  ctx.save();
  ctx.clip();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-24, -36, 48, 20);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-24, -16);
  ctx.lineTo(24, -16);
  ctx.stroke();
  ctx.restore();

  // Re-stroke outer body outline cleanly
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(0, -34);
  ctx.bezierCurveTo(18, -18, 19, 8, 15, 22);
  ctx.lineTo(-15, 22);
  ctx.bezierCurveTo(-19, 8, -18, -18, 0, -34);
  ctx.closePath();
  ctx.stroke();

  // Porthole window
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 1, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Window shine
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.ellipse(-3, -2.5, 3.2, 2, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBullet(ctx, x, y, radius, time) {
  ctx.save();
  ctx.translate(x, y);

  // Outer glow
  ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 2, radius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Tail streak
  const tailGrad = ctx.createLinearGradient(0, 0, 0, radius * 3.5);
  tailGrad.addColorStop(0, '#fde047');
  tailGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = tailGrad;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.6, 0);
  ctx.lineTo(radius * 0.6, 0);
  ctx.lineTo(0, radius * 3.4);
  ctx.closePath();
  ctx.fill();

  // Spinning star bolt
  ctx.rotate(time * 8);
  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const spikes = 4;
  const outer = radius * 1.25;
  const inner = radius * 0.55;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / spikes;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawBackground(ctx, width, height, clouds, time) {
  // Bright cheerful gradient sky
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#38bdf8');
  sky.addColorStop(0.55, '#bae6fd');
  sky.addColorStop(1, '#fef9c3');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Smiling sun in top-left corner
  const sunX = Math.min(width * 0.14, 90);
  const sunY = Math.min(height * 0.14, 80);
  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(time * 0.2);
  ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Fluffy cartoon clouds
  clouds.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.arc(-20, 6, 16, 0, Math.PI * 2);
    ctx.arc(21, 6, 17, 0, Math.PI * 2);
    ctx.arc(0, 10, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Soft pastel hills at the very bottom behind the rocket
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height - 34);
  ctx.quadraticCurveTo(width * 0.25, height - 62, width * 0.55, height - 32);
  ctx.quadraticCurveTo(width * 0.82, height - 8, width, height - 38);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, height - 18);
  ctx.quadraticCurveTo(width * 0.35, height - 36, width * 0.7, height - 16);
  ctx.quadraticCurveTo(width * 0.88, height - 6, width, height - 22);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
}

  window.FruitRocket.sprites = {
    ITEM_TYPES,
    GOOD_KEYS,
    BAD_KEYS,
    drawItem,
    drawRocket,
    drawBullet,
    drawBackground,
  };
})();
