import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../public/icons/logo-mark.svg');
const iconsDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  const sizes = [48, 72, 96, 128, 144, 192, 256, 384, 512];
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`));
  }

  // Maskable with safe area margin
  for (const size of [192, 512]) {
    const innerSize = Math.round(size * 0.8);
    const padding = Math.round((size - innerSize) / 2);
    const inner = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: '#0F766E'
      }
    })
      .composite([{ input: inner, top: padding, left: padding }])
      .png()
      .toFile(path.join(iconsDir, `icon-maskable-${size}.png`));
  }

  // Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon (32x32 png / ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All icons generated successfully.');
}

generate().catch(console.error);
