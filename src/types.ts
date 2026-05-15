export type HeaderMap = Record<string, string>;

export interface UrlManifestEntry {
  id?: string;
  url: string;
  method?: string;
  headers?: HeaderMap;
}

export interface FreezeRecord {
  id: string;
  method: string;
  url: string;
  status: number;
  recordedAt: string;
  headers: HeaderMap;
  bodyFile: string;
  bodySha256: string;
  bodyBytes: number;
  contentType?: string;
}

export interface FreezePack {
  schema: 'fetchfreeze.v1';
  createdAt: string;
  records: FreezeRecord[];
}

export interface CheckIssue {
  level: 'error' | 'warning';
  code: string;
  message: string;
  recordId?: string;
}

export interface CheckReport {
  ok: boolean;
  checkedAt: string;
  recordCount: number;
  issues: CheckIssue[];
}

export interface RecordOptions {
  outDir: string;
  headerAllowlist: string[];
  dryRun?: boolean;
}

export interface ReplayRoute {
  id: string;
  method: string;
  url: string;
  path: string;
  fixtureUrl: string;
  status: number;
  bodyFile: string;
}
