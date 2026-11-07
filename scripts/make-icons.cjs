const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const source = path.join(root, 'resources', 'brand', 'icon-source.png');
const iconPng = path.join(root, 'resources', 'assets', 'icon.png');
const iconIco = path.join(root, 'resources', 'assets', 'icon.ico');
const rendererIcon = path.join(root, 'src', 'assets', 'icon.png');

async function main() {
  if (!fs.existsSync(source)) {
    throw new Error(`品牌图标不存在: ${source}`);
  }
  fs.mkdirSync(path.dirname(iconPng), { recursive: true });
  fs.mkdirSync(path.dirname(rendererIcon), { recursive: true });

  await sharp(source).resize(512, 512, { fit: 'cover' }).png().toFile(iconPng);
  fs.copyFileSync(iconPng, rendererIcon);

  const { default: pngToIco } = await import('png-to-ico');
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngs = [];
  for (const size of sizes) {
    pngs.push(await sharp(source).resize(size, size, { fit: 'cover' }).png().toBuffer());
  }
  const ico = await pngToIco(pngs);
  fs.writeFileSync(iconIco, ico);
  console.log(`图标已生成: ${iconPng}, ${iconIco}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
