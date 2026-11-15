const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const iconsDir = path.join(__dirname, "..", "assets", "icons");
fs.mkdirSync(iconsDir, { recursive: true });

// Standard editorial emblem SVG (with rounded corners for vector icon / favicon)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect x="0" y="0" width="512" height="512" rx="108" fill="#111317"/>
  <rect x="20" y="20" width="472" height="472" rx="92" fill="none" stroke="#2D333E" stroke-width="4"/>
  <!-- Stylized diamond road sign contour -->
  <path d="M256 76 L436 256 L256 436 L76 256 Z" fill="#181C22" stroke="#D97706" stroke-width="14" stroke-linejoin="round"/>
  <!-- Road lane ticks inside lower quadrant -->
  <path d="M256 348 L256 384" stroke="#F59E0B" stroke-width="10" stroke-linecap="round"/>
  <!-- Bold License Class B letterform -->
  <text x="256" y="302" text-anchor="middle" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800" font-size="184" fill="#FAFAFA" letter-spacing="-4">B</text>
</svg>
`;

// Maskable full-bleed SVG (no transparent corners, artwork centered inside 72% safe area)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect x="0" y="0" width="512" height="512" fill="#111317"/>
  <g transform="translate(51.2, 51.2) scale(0.8)">
    <path d="M256 76 L436 256 L256 436 L76 256 Z" fill="#181C22" stroke="#D97706" stroke-width="14" stroke-linejoin="round"/>
    <path d="M256 348 L256 384" stroke="#F59E0B" stroke-width="10" stroke-linecap="round"/>
    <text x="256" y="302" text-anchor="middle" font-family="Inter, Arial, Helvetica, sans-serif" font-weight="800" font-size="184" fill="#FAFAFA" letter-spacing="-4">B</text>
  </g>
</svg>
`;

const iconSvgPath = path.join(iconsDir, "icon.svg");
const maskableTmpSvgPath = path.join(iconsDir, "_maskable.svg");
fs.writeFileSync(iconSvgPath, iconSvg, "utf8");
fs.writeFileSync(maskableTmpSvgPath, maskableSvg, "utf8");

function renderPng(srcSvg, outName, size) {
  const outPath = path.join(iconsDir, outName);
  execFileSync("convert", [
    "-background", "none",
    "-density", "384",
    srcSvg,
    "-resize", `${size}x${size}`,
    `PNG32:${outPath}`,
  ]);
  return outPath;
}

renderPng(iconSvgPath, "icon-192.png", 192);
renderPng(iconSvgPath, "icon-512.png", 512);
renderPng(maskableTmpSvgPath, "icon-maskable-512.png", 512);
// Apple touch icon prefers opaque background
renderPng(maskableTmpSvgPath, "apple-touch-icon-180.png", 180);

fs.unlinkSync(maskableTmpSvgPath);
console.log("Generated PWA icons in", iconsDir);
