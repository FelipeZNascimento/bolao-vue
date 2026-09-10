export interface IAdminCacheEntry {
  key: string;
  expiresAt: string | null; // ISO timestamp; null = no expiry
  valuePreview: string;
}

export interface IAdminCacheStats {
  hits: number;
  misses: number;
  keys: number;
  ksize: number;
  vsize: number;
}

export interface IAdminCacheResponse {
  entries: IAdminCacheEntry[];
  stats: IAdminCacheStats;
}

// The value stored for a specific key – could be any JSON
export type IAdminCacheDetail = unknown;
