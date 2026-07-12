interface ModelEntry {
  displayName: string;
  platform: 'otherpass' | 'v3pash' | 'z10';
}

const modelMap: Record<string, ModelEntry> = {
  I25:  { displayName: 'Z7',      platform: 'otherpass' },
  I25C: { displayName: 'Z7 (C)',  platform: 'otherpass' },
  I25D: { displayName: 'Z7 (D)',  platform: 'otherpass' },
  I20:  { displayName: 'Z7 3G',   platform: 'otherpass' },
  I32:  { displayName: 'Z8',      platform: 'otherpass' },
  I33:  { displayName: 'Z8 Pro',  platform: 'otherpass' },
  ND01: { displayName: 'Z9',      platform: 'v3pash'    },
  ND03: { displayName: 'Z9 (ND03)', platform: 'v3pash'  },
  ND07: { displayName: 'Z10',     platform: 'z10'       },
  ND08: { displayName: 'Z10 (ND08)', platform: 'z10'    },
  ND09: { displayName: 'Z10 (ND09)', platform: 'z10'    },
};

export function getModelInfo(innermodel: string): ModelEntry | null {
  return modelMap[innermodel] ?? null;
}

export function getDisplayName(innermodel: string): string {
  return modelMap[innermodel]?.displayName ?? innermodel;
}

export function getPlatform(innermodel: string): string {
  return modelMap[innermodel]?.platform ?? 'otherpass';
}

export function getAllModels(): [string, ModelEntry][] {
  return Object.entries(modelMap);
}
