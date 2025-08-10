const fs = require('fs');
const { createCanvas } = require('canvas');

// Create assets directory if it doesn't exist
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

function createSprite(name, color, size = 32) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
    
    // Add border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size-2, size-2);
    
    // Add text
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name.substring(0, 3), size/2, size/2 + 4);
    
    return canvas;
}

function createTurtleSheet() {
    const canvas = createCanvas(96, 32); // 3 frames x 32
    const ctx = canvas.getContext('2d');
    
    // Frame 1: Normal
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 0, 32, 32);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 30, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TUR', 16, 20);
    
    // Frame 2: Moving
    ctx.fillStyle = '#00cc00';
    ctx.fillRect(32, 0, 32, 32);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(33, 1, 30, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('TLE', 48, 20);
    
    // Frame 3: Power-up
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(64, 0, 32, 32);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 1, 30, 30);
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PWR', 80, 20);
    
    return canvas;
}

const assets = [
    { name: 'turtle-sheet', generator: createTurtleSheet },
    { name: 'plastic-bottle', color: '#ff0000', size: 24 },
    { name: 'fishing-net', color: '#808080', size: 28 },
    { name: 'soda-can', color: '#ff8000', size: 20 },
    { name: 'plastic-bag', color: '#0080ff', size: 26 },
    { name: 'shark', color: '#404040', size: 40 },
    { name: 'jellyfish', color: '#ff00ff', size: 30 },
    { name: 'turbo', color: '#ffff00', size: 24 },
    { name: 'shield', color: '#ff8000', size: 24 },
    { name: 'magnet', color: '#8000ff', size: 24 },
    { name: 'ocean-bg', color: '#0080ff', size: 64 },
    { name: 'bubble', color: '#00ffff', size: 16 }
];

console.log('Generating game assets...');

assets.forEach(asset => {
    let canvas;
    if (asset.generator) {
        canvas = asset.generator();
    } else {
        canvas = createSprite(asset.name, asset.color, asset.size);
    }
    
    const buffer = canvas.toBuffer('image/png');
    const filename = `assets/${asset.name}.png`;
    fs.writeFileSync(filename, buffer);
    console.log(`Created: ${filename}`);
});

console.log('All assets generated successfully!');
console.log('Note: You may need to install the canvas package: npm install canvas');
