const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = path.join(root, 'resources', 'brand', 'icon-source.png');

if (!fs.existsSync(source)) {
  console.error(`缺少品牌图标: ${source}`);
  process.exit(1);
}

console.log(`品牌图标就绪: ${source}`);
