import fs from 'node:fs';
import { inflateSync } from 'node:zlib';

const logger = {
  info: (...args: any[]) => console.log('[ApkParser]', ...args),
};

function parseZipEntries(buffer: Buffer) {
  const entries: any[] = [];
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65536); i--) {
    if (buffer.readUInt32LE(i) === 101010256) { eocdOffset = i; break; }
  }
  if (eocdOffset < 0) throw new Error('ZIP EOCD 未找到');
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const cdCount = buffer.readUInt16LE(eocdOffset + 10);
  let pos = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buffer.readUInt32LE(pos) !== 33639248) break;
    const compressionMethod = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const uncompressedSize = buffer.readUInt32LE(pos + 24);
    const filenameLength = buffer.readUInt16LE(pos + 28);
    const extraFieldLength = buffer.readUInt16LE(pos + 30);
    const commentLength = buffer.readUInt16LE(pos + 32);
    const localHeaderOffset = buffer.readUInt32LE(pos + 42);
    const filename = buffer.toString('utf8', pos + 46, pos + 46 + filenameLength);
    entries.push({ filename, offset: localHeaderOffset, compressedSize, uncompressedSize, compressionMethod });
    pos += 46 + filenameLength + extraFieldLength + commentLength;
  }
  return entries;
}

function extractZipEntry(buffer: Buffer, entry: any) {
  if (entry.offset + 30 > buffer.length) throw new Error('ZIP entry offset 超出 buffer');
  const localFilenameLength = buffer.readUInt16LE(entry.offset + 26);
  const localExtraLength = buffer.readUInt16LE(entry.offset + 28);
  const dataOffset = entry.offset + 30 + localFilenameLength + localExtraLength;
  if (dataOffset > buffer.length) throw new Error('ZIP data offset 超出 buffer');
  if (entry.compressionMethod === 0) {
    const end = Math.min(dataOffset + entry.uncompressedSize, buffer.length);
    return buffer.subarray(dataOffset, end);
  } else if (entry.compressionMethod === 8) {
    const end = Math.min(dataOffset + entry.compressedSize, buffer.length);
    const compressed = buffer.subarray(dataOffset, end);
    return inflateSync(compressed);
  }
  throw new Error('不支持的压缩方法: ' + entry.compressionMethod);
}

class AxmlParser {
  buffer: Buffer;
  pos = 0;
  strings: string[] = [];

  constructor(buffer: Buffer) { this.buffer = buffer; }

  parse() {
    const magic = this.readUInt16(0);
    if (magic !== 3) throw new Error('AXML magic 错误: 0x' + magic.toString(16));
    this.pos = 8;
    const result: any = { permissions: [] };
    while (this.pos < this.buffer.length) {
      const chunkType = this.readUInt16(this.pos);
      const chunkSize = this.readUInt32(this.pos + 4);
      switch (chunkType) {
        case 1: this.parseStringPool(); break;
        case 384: this.parseStartTag(result); break;
        default: this.pos += chunkSize; break;
      }
    }
    return result;
  }

  parseStringPool() {
    const startPos = this.pos;
    const stringCount = this.readUInt32(startPos + 8);
    const stringsStart = this.readUInt32(startPos + 12);
    const offsets: number[] = [];
    for (let i = 0; i < stringCount; i++) { offsets.push(this.readUInt32(startPos + 20 + i * 4)); }
    this.strings = [];
    for (let i = 0; i < stringCount; i++) {
      const strOffset = startPos + stringsStart + offsets[i];
      let len = this.buffer.readUInt16LE(strOffset);
      if (len & 32768) {
        len = (len & 32767) << 16 | this.buffer.readUInt16LE(strOffset + 2);
        const strData = this.buffer.toString('utf16le', strOffset + 4, strOffset + 4 + len * 2);
        this.strings.push(strData);
      } else {
        const strData = this.buffer.toString('utf16le', strOffset + 2, strOffset + 2 + len * 2);
        this.strings.push(strData);
      }
    }
    const chunkSize = this.readUInt32(startPos + 4);
    this.pos = startPos + chunkSize;
  }

  parseStartTag(result: any) {
    const startPos = this.pos;
    const attrCount = this.readUInt16(startPos + 14);
    const attrStart = startPos + 36;
    for (let i = 0; i < attrCount; i++) {
      const attrPos = attrStart + i * 20;
      if (attrPos + 20 > this.buffer.length) break;
      const nameIdx = this.readUInt32(attrPos + 4);
      const valueIdx = this.readUInt32(attrPos + 12);
      const attrName = nameIdx < this.strings.length ? this.strings[nameIdx] : '';
      const attrValue = valueIdx < this.strings.length ? this.strings[valueIdx] : '';
      if (attrName === 'package' && attrValue) { result.packageName = attrValue; }
      else if (attrName === 'versionName' && attrValue) { result.versionName = attrValue; }
      else if (attrName === 'versionCode') { const rawValue = this.readUInt32(attrPos + 16); if (rawValue) { result.versionCode = String(rawValue); } else if (attrValue) { result.versionCode = attrValue; } }
      else if (attrName === 'minSdkVersion') { const rawValue = this.readUInt32(attrPos + 16); if (rawValue) { result.minSdkVersion = rawValue; } }
      else if (attrName === 'targetSdkVersion') { const rawValue = this.readUInt32(attrPos + 16); if (rawValue) { result.targetSdkVersion = rawValue; } }
      else if (attrName === 'name' && attrValue && attrValue.startsWith('android.permission.')) { result.permissions.push(attrValue.replace('android.permission.', '')); }
      else if (attrName === 'label' && attrValue && !attrValue.startsWith('@')) { result.label = attrValue; }
    }
    const chunkSize = this.readUInt32(startPos + 4);
    this.pos = startPos + chunkSize;
  }

  readUInt16(offset: number) { if (offset + 2 > this.buffer.length) return 0; return this.buffer.readUInt16LE(offset); }
  readUInt32(offset: number) { if (offset + 4 > this.buffer.length) return 0; return this.buffer.readUInt32LE(offset); }
}

class ApkParserClass {
  async parse(apkPath: string) {
    if (!fs.existsSync(apkPath)) { throw new Error('文件不存在: ' + apkPath); }
    const stat = fs.statSync(apkPath);
    const buffer = fs.readFileSync(apkPath);
    const entries = parseZipEntries(buffer);
    logger.info('APK 包含 ' + entries.length + ' 个文件');
    const manifestEntry = entries.find((e: any) => e.filename === 'AndroidManifest.xml');
    if (!manifestEntry) { throw new Error('AndroidManifest.xml 不存在'); }
    const manifestData = extractZipEntry(buffer, manifestEntry);
    const parser = new AxmlParser(manifestData);
    const parsed = parser.parse();
    const abis: string[] = [];
    let dexSize: number | undefined;
    let signer: string | undefined;
    let iconEntry: any = null;
    for (const entry of entries) {
      const libMatch = entry.filename.match(/^lib\/([^/]+)\//);
      if (libMatch && !abis.includes(libMatch[1])) { abis.push(libMatch[1]); }
      if (entry.filename === 'classes.dex' || entry.filename.match(/^classes\d+\.dex$/)) { dexSize = (dexSize ?? 0) + entry.uncompressedSize; }
      if (entry.filename.match(/^META-INF\/.*\.(RSA|DSA|EC)$/)) { signer = entry.filename.split('/').pop(); }
    }
    const iconPatterns = [
      /^res\/mipmap-xxxhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-xxhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-xhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-hdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-mdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-[^/]+\/ic_launcher\.png$/i,
      /^res\/drawable-[^/]+\/ic_launcher\.png$/i,
      /^res\/drawable\/ic_launcher\.png$/i,
      /^res\/mipmap-xxxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-xxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-[^/]+\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-xxxhdpi\/[^/]+\.png$/i,
      /^res\/mipmap-xxhdpi\/[^/]+\.png$/i,
      /^res\/mipmap-[^/]+\/[^/]+\.png$/i,
    ];
    for (const pattern of iconPatterns) { iconEntry = entries.find((e: any) => pattern.test(e.filename)) ?? null; if (iconEntry) break; }
    let iconBase64: string | undefined;
    let iconMime: string | undefined;
    if (iconEntry) {
      try {
        const iconData = extractZipEntry(buffer, iconEntry);
        if (iconData.length < 512 * 1024) { iconBase64 = iconData.toString('base64'); iconMime = iconEntry.filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'; }
      } catch {}
    }
    const info = {
      packageName: parsed.packageName, versionName: parsed.versionName, versionCode: parsed.versionCode,
      minSdkVersion: parsed.minSdkVersion, targetSdkVersion: parsed.targetSdkVersion,
      permissions: parsed.permissions ?? [], apkSize: stat.size, dexSize, abis, signer,
      label: parsed.label, iconBase64, iconMime,
    };
    logger.info('解析成功: ' + info.packageName + ' v' + (info.versionName ?? '?') + '(' + info.permissions.length + ' 权限, 图标: ' + (iconBase64 ? '有' : '无') + ')');
    return info;
  }
}

export const apkParser = new ApkParserClass();
export default apkParser;
