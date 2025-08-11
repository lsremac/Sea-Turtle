const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas for drawing
function createGameAssets() {
  console.log('🐢 Generating TurtleQuest game assets...');
  
  // Create assets directory if it doesn't exist
  if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
  }
  
  // Generate turtle spritesheet (4x4 grid of 32x32 sprites)
  const turtleCanvas = createCanvas(128, 128);
  const turtleCtx = turtleCanvas.getContext('2d');
  
  // Draw turtle sprites
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      drawTurtleSprite(turtleCtx, col * 32, row * 32, row * 4 + col);
    }
  }
  
  // Save turtle spritesheet
  const turtleBuffer = turtleCanvas.toBuffer('image/png');
  fs.writeFileSync('assets/turtle-sheet.png', turtleBuffer);
  console.log('✅ Turtle spritesheet created');
  
  // Generate trash items (2x2 grid of 32x32 sprites)
  const trashCanvas = createCanvas(64, 64);
  const trashCtx = trashCanvas.getContext('2d');
  
  const trashTypes = ['bottle', 'can', 'bag', 'net'];
  trashTypes.forEach((type, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    drawTrashItem(trashCtx, col * 32, row * 32, type);
  });
  
  const trashBuffer = trashCanvas.toBuffer('image/png');
  fs.writeFileSync('assets/trash-items.png', trashBuffer);
  console.log('✅ Trash items created');
  
  // Generate hazards (2x2 grid of 32x32 sprites)
  const hazardsCanvas = createCanvas(64, 64);
  const hazardsCtx = hazardsCanvas.getContext('2d');
  
  const hazardTypes = ['shark', 'jellyfish'];
  hazardTypes.forEach((type, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    drawHazard(hazardsCtx, col * 32, row * 32, type);
  });
  
  const hazardsBuffer = hazardsCanvas.toBuffer('image/png');
  fs.writeFileSync('assets/hazards.png', hazardsBuffer);
  console.log('✅ Hazards created');
  
  // Generate power-ups (2x2 grid of 32x32 sprites)
  const powerupsCanvas = createCanvas(64, 64);
  const powerupsCtx = powerupsCanvas.getContext('2d');
  
  const powerupTypes = ['turbo', 'shield', 'magnet'];
  powerupTypes.forEach((type, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    drawPowerUp(powerupsCtx, col * 32, row * 32, type);
  });
  
  const powerupsBuffer = powerupsCanvas.toBuffer('image/png');
  fs.writeFileSync('assets/powerups.png', powerupsBuffer);
  console.log('✅ Power-ups created');
  
  // Generate background
  const backgroundCanvas = createCanvas(256, 128);
  const backgroundCtx = backgroundCanvas.getContext('2d');
  drawBackground(backgroundCtx);
  
  const backgroundBuffer = backgroundCanvas.toBuffer('image/png');
  fs.writeFileSync('assets/background.png', backgroundBuffer);
  console.log('✅ Background created');
  
  console.log('🎉 All game assets generated successfully!');
}

function drawTurtleSprite(ctx, x, y, frame) {
  const size = 32;
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  
  // Turtle body (oval)
  ctx.fillStyle = '#2d5a27';
  ctx.beginPath();
  ctx.ellipse(0, 0, size/2 - 2, size/3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Turtle shell
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.ellipse(0, -2, size/2 - 4, size/3 - 2, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Shell pattern
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(0, -2, size/2 - 6 - i*2, size/3 - 4 - i*2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Head
  ctx.fillStyle = '#2d5a27';
  ctx.beginPath();
  ctx.ellipse(size/2 - 4, 0, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(size/2 - 2, -1, 1, 0, Math.PI * 2);
  ctx.arc(size/2 - 2, 1, 1, 0, Math.PI * 2);
  ctx.fill();
  
  // Flippers
  ctx.fillStyle = '#2d5a27';
  ctx.beginPath();
  ctx.ellipse(-size/2 + 2, -size/3, 4, 8, Math.PI/4, 0, Math.PI * 2);
  ctx.ellipse(-size/2 + 2, size/3, 4, 8, -Math.PI/4, 0, Math.PI * 2);
  ctx.fill();
  
  // Animation frames
  if (frame === 1) {
    ctx.translate(2, 0);
  } else if (frame === 2) {
    ctx.translate(-2, 0);
  } else if (frame === 3) {
    ctx.translate(0, 2);
  }
  
  ctx.restore();
}

function drawTrashItem(ctx, x, y, type) {
  const size = 32;
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  
  switch(type) {
    case 'bottle':
      // Plastic bottle
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-6, -12, 12, 24);
      ctx.fillStyle = '#008000';
      ctx.fillRect(-6, -12, 12, 4);
      ctx.fillRect(-6, 8, 12, 4);
      break;
    case 'can':
      // Soda can
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-8, -10, 16, 20);
      ctx.fillStyle = '#cc0000';
      ctx.fillRect(-8, -10, 16, 4);
      break;
    case 'bag':
      // Plastic bag
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(-8, -8);
      ctx.lineTo(8, -8);
      ctx.lineTo(6, 8);
      ctx.lineTo(-6, 8);
      ctx.closePath();
      ctx.fill();
      break;
    case 'net':
      // Fishing net
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, -8);
        ctx.lineTo(i, 8);
        ctx.stroke();
      }
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.moveTo(-8, i);
        ctx.lineTo(8, i);
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
}

function drawHazard(ctx, x, y, type) {
  const size = 32;
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  
  switch(type) {
    case 'shark':
      // Shark
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.moveTo(-size/2, 0);
      ctx.lineTo(size/2, -size/3);
      ctx.lineTo(size/2, size/3);
      ctx.closePath();
      ctx.fill();
      
      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(size/4, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Teeth
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(size/4 - i*3, -3);
        ctx.lineTo(size/4 - i*3, 3);
        ctx.lineTo(size/4 - i*3 - 2, 0);
        ctx.closePath();
        ctx.fill();
      }
      break;
    case 'jellyfish':
      // Jellyfish
      ctx.fillStyle = '#ff69b4';
      ctx.beginPath();
      ctx.arc(0, -size/4, size/3, 0, Math.PI * 2);
      ctx.fill();
      
      // Tentacles
      ctx.strokeStyle = '#ff69b4';
      ctx.lineWidth = 3;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i*3, size/4);
        ctx.lineTo(i*3, size/2);
        ctx.stroke();
      }
      break;
  }
  ctx.restore();
}

function drawPowerUp(ctx, x, y, type) {
  const size = 32;
  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  
  switch(type) {
    case 'turbo':
      // Turbo power-up
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(-size/2, 0);
      ctx.lineTo(size/2, -size/3);
      ctx.lineTo(size/2, size/3);
      ctx.closePath();
      ctx.fill();
      
      // Lightning bolt
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.lineTo(3, -3);
      ctx.lineTo(-2, 0);
      ctx.lineTo(4, 3);
      ctx.lineTo(-3, 6);
      ctx.closePath();
      ctx.fill();
      break;
    case 'shield':
      // Shield power-up
      ctx.fillStyle = '#4169e1';
      ctx.beginPath();
      ctx.arc(0, 0, size/2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#000080';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, size/2 - 3, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'magnet':
      // Magnet power-up
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-size/3, -size/2, size/1.5, size);
      
      ctx.fillStyle = '#800000';
      ctx.fillRect(-size/3, -size/2, size/1.5, size/4);
      ctx.fillRect(-size/3, size/4, size/1.5, size/4);
      break;
  }
  ctx.restore();
}

function drawBackground(ctx) {
  // Ocean background
  const gradient = ctx.createLinearGradient(0, 0, 0, 128);
  gradient.addColorStop(0, '#87ceeb');
  gradient.addColorStop(1, '#006994');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);
  
  // Bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 128;
    const size = Math.random() * 8 + 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Seaweed
  ctx.fillStyle = '#228b22';
  for (let i = 0; i < 8; i++) {
    const x = i * 32;
    ctx.beginPath();
    ctx.moveTo(x, 128);
    ctx.quadraticCurveTo(x + 10, 100, x, 80);
    ctx.quadraticCurveTo(x - 10, 60, x, 40);
    ctx.quadraticCurveTo(x + 10, 20, x, 0);
    ctx.strokeStyle = '#228b22';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// Run the asset generation
createGameAssets();
