const path = require('node:path');
const sharp = require(process.env.STARLIGHT_SHARP || 'sharp');

const assets = path.resolve(__dirname, '../dist/assets');
const sources = path.resolve(__dirname, 'source-art');
const heroes = ['knight', 'mage', 'scholar', 'ranger', 'healer', 'explorer'];
const walkEdges = [0, 181, 362, 543, 724, 905, 1086];
const poseEdges = [0, 191, 374, 553, 721, 886, 1024];
const cellWidth = 256;
const cellHeight = 200;

function foreignEdgePixel(hero, x, y, height, red, green, blue) {
  const isRed = red > 100 && red > green * 1.25 && red > blue * 1.25;
  const isBlue = blue > red * 1.12 && blue > green * 1.05;
  const isYellow = red > 120 && green > 95 && blue < Math.min(red, green) * 0.78;
  if (hero === 'mage' && y >= height - 9) return isBlue;
  if (hero === 'scholar' && y < 12) return isRed;
  if (hero === 'ranger' && y < 10) return isBlue;
  if (hero === 'healer' && y >= height - 14) return isBlue;
  if (hero === 'explorer' && y < 18 && x > 1200) return isYellow;
  return false;
}

async function poseRow(hero, top, height) {
  const { data, info } = await sharp(path.join(sources, 'hero-party-poses.png'))
    .extract({ left: 0, top, width: 1536, height })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const pixel = (y * info.width + x) * info.channels;
      // Keep frame one clear of fragments from frame two.
      if (x >= 232 && x < 256) {
        data[pixel + 3] = 0;
      } else if (data[pixel + 3] > 0 && foreignEdgePixel(hero, x, y, height,
          data[pixel], data[pixel + 1], data[pixel + 2])) {
        data[pixel + 3] = 0;
      }
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } });
}

async function build(index) {
  const hero = heroes[index];
  const overlays = [];
  for (let frame = 0; frame < 8; frame++) {
    const input = await sharp(path.join(sources, 'hero-party-walk.png'))
      .extract({ left: frame * 181, top: walkEdges[index], width: 181, height: 181 })
      .resize(200, 200).png().toBuffer();
    overlays.push({ input, left: frame * cellWidth + 28, top: 0 });
  }

  const height = poseEdges[index + 1] - poseEdges[index];
  const row = await poseRow(hero, poseEdges[index], height);
  const rowBuffer = await row.png().toBuffer();
  for (let frame = 0; frame < 6; frame++) {
    const input = await sharp(rowBuffer)
      .extract({ left: frame * cellWidth, top: 0, width: cellWidth, height })
      .png().toBuffer();
    overlays.push({ input, left: (frame + 8) * cellWidth, top: Math.floor((cellHeight - height) / 2) });
  }

  const output = path.join(assets, `hero-${hero}-sprite-strip.png`);
  await sharp({ create: {
    width: 14 * cellWidth, height: cellHeight, channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }}).composite(overlays).png().toFile(output);
  console.log(`${path.basename(output)}: 3584 × 200, 14 frames in one row`);
}

(async () => {
  for (let index = 0; index < heroes.length; index++) await build(index);
})().catch(error => { console.error(error); process.exitCode = 1; });
