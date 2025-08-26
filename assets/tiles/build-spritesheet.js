#!/usr/bin/env node

// Simple spritesheet builder for mahjong tiles
// This script creates a fallback spritesheet from individual tile images

const fs = require('fs');
const path = require('path');

const TILE_WIDTH = 64;
const TILE_HEIGHT = 88;
const TILES_PER_ROW = 10;

// Define all tile types for Hong Kong Basic Mahjong
const TILES = [
  // Characters (Man) 1-9
  ...Array.from({length: 9}, (_, i) => `man-${i + 1}`),
  // Circles (Pin) 1-9  
  ...Array.from({length: 9}, (_, i) => `pin-${i + 1}`),
  // Bamboo (Sou) 1-9
  ...Array.from({length: 9}, (_, i) => `sou-${i + 1}`),
  // Honor tiles
  'honor-east', 'honor-south', 'honor-west', 'honor-north',
  'honor-red', 'honor-green', 'honor-white'
];

function generateSVGTile(tileKey) {
  const [suit, value] = tileKey.split('-');
  
  let content = '';
  let bgColor = '#f8f9fa';
  let textColor = '#333';
  
  if (suit === 'man') {
    content = `${value}萬`;
    textColor = '#dc2626'; // red
  } else if (suit === 'pin') {
    content = `${value}筒`;
    textColor = '#2563eb'; // blue
  } else if (suit === 'sou') {
    content = `${value}索`;
    textColor = '#16a34a'; // green
  } else if (suit === 'honor') {
    textColor = '#7c3aed'; // purple
    const honorMap = {
      east: '東', south: '南', west: '西', north: '北',
      red: '中', green: '發', white: '白'
    };
    content = honorMap[value] || value;
  }

  return `<svg width="${TILE_WIDTH}" height="${TILE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${TILE_WIDTH}" height="${TILE_HEIGHT}" fill="${bgColor}" stroke="#ccc" stroke-width="2" rx="4"/>
  <text x="${TILE_WIDTH/2}" y="${TILE_HEIGHT/2 + 8}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${textColor}" text-anchor="middle">${content}</text>
</svg>`;
}

function generateCSS() {
  let css = `.mahjong-tile {
  display: inline-block;
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;
  background-image: url('./spritesheet.svg');
  background-repeat: no-repeat;
}\n\n`;

  TILES.forEach((tile, index) => {
    const row = Math.floor(index / TILES_PER_ROW);
    const col = index % TILES_PER_ROW;
    const x = col * TILE_WIDTH;
    const y = row * TILE_HEIGHT;
    
    css += `.mahjong-tile-${tile} {
  background-position: -${x}px -${y}px;
}\n\n`;
  });

  return css;
}

function generateSpritesheet() {
  const rows = Math.ceil(TILES.length / TILES_PER_ROW);
  const sheetWidth = TILES_PER_ROW * TILE_WIDTH;
  const sheetHeight = rows * TILE_HEIGHT;

  let svg = `<svg width="${sheetWidth}" height="${sheetHeight}" xmlns="http://www.w3.org/2000/svg">\n`;

  TILES.forEach((tile, index) => {
    const row = Math.floor(index / TILES_PER_ROW);
    const col = index % TILES_PER_ROW;
    const x = col * TILE_WIDTH;
    const y = row * TILE_HEIGHT;

    const [suit, value] = tile.split('-');
    let content = '';
    let textColor = '#333';

    if (suit === 'man') {
      content = `${value}萬`;
      textColor = '#dc2626';
    } else if (suit === 'pin') {
      content = `${value}筒`;
      textColor = '#2563eb';
    } else if (suit === 'sou') {
      content = `${value}索`;
      textColor = '#16a34a';
    } else if (suit === 'honor') {
      textColor = '#7c3aed';
      const honorMap = {
        east: '東', south: '南', west: '西', north: '北',
        red: '中', green: '發', white: '白'
      };
      content = honorMap[value] || value;
    }

    svg += `  <g transform="translate(${x}, ${y})">
    <rect width="${TILE_WIDTH}" height="${TILE_HEIGHT}" fill="#f8f9fa" stroke="#ccc" stroke-width="2" rx="4"/>
    <text x="${TILE_WIDTH/2}" y="${TILE_HEIGHT/2 + 8}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${textColor}" text-anchor="middle">${content}</text>
  </g>\n`;
  });

  svg += '</svg>';
  return svg;
}

function generateFallbackImages() {
  const individualDir = path.join(__dirname, 'individual');
  
  if (!fs.existsSync(individualDir)) {
    fs.mkdirSync(individualDir, { recursive: true });
  }

  TILES.forEach(tile => {
    const svg = generateSVGTile(tile);
    fs.writeFileSync(path.join(individualDir, `${tile}.svg`), svg);
  });

  console.log(`Generated ${TILES.length} individual tile SVGs`);
}

function build() {
  console.log('Building Mahjong tile assets...');
  
  // Generate individual SVG files
  generateFallbackImages();
  
  // Generate spritesheet
  const spritesheet = generateSpritesheet();
  fs.writeFileSync(path.join(__dirname, 'spritesheet.svg'), spritesheet);
  console.log('Generated spritesheet.svg');
  
  // Generate CSS
  const css = generateCSS();
  fs.writeFileSync(path.join(__dirname, 'tiles.css'), css);
  console.log('Generated tiles.css');
  
  // Generate tile mapping JSON
  const mapping = {};
  TILES.forEach((tile, index) => {
    const row = Math.floor(index / TILES_PER_ROW);
    const col = index % TILES_PER_ROW;
    mapping[tile] = {
      index,
      row,
      col,
      x: col * TILE_WIDTH,
      y: row * TILE_HEIGHT
    };
  });
  
  fs.writeFileSync(path.join(__dirname, 'tile-mapping.json'), JSON.stringify(mapping, null, 2));
  console.log('Generated tile-mapping.json');
  
  console.log('\nTile assets built successfully!');
  console.log(`Total tiles: ${TILES.length}`);
  console.log(`Spritesheet size: ${TILES_PER_ROW * TILE_WIDTH}x${Math.ceil(TILES.length / TILES_PER_ROW) * TILE_HEIGHT}`);
}

if (require.main === module) {
  build();
}

module.exports = { build, TILES };