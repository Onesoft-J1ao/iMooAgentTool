import iconv from 'iconv-lite';

export function decodeGbk(buffer: Buffer): string {
  return iconv.decode(buffer, 'gbk');
}

export function encodeGbk(text: string): Buffer {
  return iconv.encode(text, 'gbk');
}

export function splitLines(text: string): string[] {
  return text.split(/\r?\n|\r(?!\n)/).filter(Boolean);
}

export function decodeLines(buffer: Buffer): string[] {
  return splitLines(decodeGbk(buffer));
}
