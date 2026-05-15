import http, { type Server } from 'node:http';
import { readBody, readPack } from './io.js';

export interface ReplayServerOptions {
  dir: string;
  port: number;
  host?: string;
}

export async function startReplayServer(options: ReplayServerOptions): Promise<Server> {
  const pack = await readPack(options.dir);
  const server = http.createServer(async (request, response) => {
    const method = request.method ?? 'GET';
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const match = pack.records.find((record) => {
      const frozen = new URL(record.url);
      return record.method === method && frozen.pathname === requestUrl.pathname && frozen.search === requestUrl.search;
    });

    if (!match) {
      response.writeHead(404, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: 'fixture_not_found', method, path: requestUrl.pathname }));
      return;
    }

    const body = await readBody(options.dir, match.bodyFile);
    response.writeHead(match.status, {
      ...match.headers,
      'content-length': String(body.byteLength),
      'x-fetchfreeze-record': match.id
    });
    response.end(body);
  });

  await new Promise<void>((resolve) => server.listen(options.port, options.host ?? '127.0.0.1', resolve));
  return server;
}
