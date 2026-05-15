import { expect, it } from 'vitest';
import { buildRouteMap } from '../src/map.js';

it('builds deterministic route maps for serverless tests', async () => {
  await expect(buildRouteMap('tests/fixtures/good', 'http://localhost:5000')).resolves.toEqual([
    {
      id: '001-api-example.test-data',
      method: 'GET',
      url: 'https://api.example.test/data.json',
      path: '/data.json',
      fixtureUrl: 'http://localhost:5000/data.json',
      status: 200,
      bodyFile: 'bodies/001-api-example.test-data.json'
    }
  ]);
});
