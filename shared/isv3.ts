export function checkIsV3(innermodel: string, softVersion: string): boolean {
  const thresholds: Record<string, string> = {
    ND07: '1.5.1',
    ND01: '3.3.2',
    I32: '3.1.0',
    I25D: '1.5.8',
    I25C: '1.9.1',
    I25: '2.5.1',
    I20: '2.8.1',
  };

  const threshold = thresholds[innermodel];
  if (!threshold) return false;

  const normalize = (v: string) => v.split('.').map(Number);
  const a = normalize(softVersion);
  const b = normalize(threshold);

  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const va = a[i] || 0;
    const vb = b[i] || 0;
    if (va > vb) return true;
    if (va < vb) return false;
  }
  return false;
}
