import { readPack } from './io.js';
import type { ReplayRoute } from './types.js';

export async function buildRouteMap(dir: string, baseUrl = 'http://127.0.0.1:4177'): Promise<ReplayRoute[]> {
  const pack = await readPack(dir);
  return pack.records.map((record) => {
    const source = new URL(record.url);
    return {
      id: record.id,
      method: record.method,
      url: record.url,
      path: source.pathname || '/',
      fixtureUrl: `${baseUrl.replace(/\/$/, '')}${source.pathname || '/'}`,
      status: record.status,
      bodyFile: record.bodyFile
    };
  });
}
