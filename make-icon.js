const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = 'D:\\Users\\Administrator\\Downloads\\image.png';
const dst = path.join(__dirname, 'resources', 'assets', 'icon.ico');

// Sharp can't output .ico directly, so create a PNG and use built-in Windows tool
// Windows accepts PNG for icons in some contexts
// Or we can just copy the PNG as icon.png and use it directly
// electron-builder can use PNG as icon source
async function main() {
  const img = sharp(src);
  const buf = await img.resize(256, 256).png().toBuffer();
  fs.writeFileSync(dst, buf);
  fs.writeFileSync(path.join(__dirname, 'resources', 'assets', 'icon.png'), buf);
  console.log('Icon prepared:', buf.length, 'bytes');
}

main().catch(err => console.error('Failed:', err.message));
