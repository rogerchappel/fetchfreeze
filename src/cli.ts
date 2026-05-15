#!/usr/bin/env node
import { readUrlManifest } from './manifest.js';
import { recordManifest } from './record.js';
import { checkPack } from './check.js';
import { buildRouteMap } from './map.js';
import { startReplayServer } from './replay.js';
import { hasFlag, parseCsv, parseDays, readOption } from './args.js';
import { helpText } from './help.js';

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const [command, target, ...rest] = argv;
  if (!command || command === '--help' || command === '-h') {
    console.log(helpText);
    return 0;
  }

  try {
    switch (command) {
      case 'record': {
        if (!target) throw new Error('record requires <manifest>');
        const outDir = readOption(rest, '--out');
        if (!outDir) throw new Error('record requires --out <dir>');
        const entries = await readUrlManifest(target);
        const pack = await recordManifest(entries, {
          outDir,
          dryRun: hasFlag(rest, '--dry-run'),
          headerAllowlist: parseCsv(readOption(rest, '--allow-headers'))
        });
        console.log(JSON.stringify({ outDir, records: pack.records.length, dryRun: hasFlag(rest, '--dry-run') }, null, 2));
        return 0;
      }
      case 'check': {
        if (!target) throw new Error('check requires <dir>');
        const report = await checkPack(target, {
          maxAgeDays: parseDays(readOption(rest, '--max-age')),
          offlineOk: hasFlag(rest, '--offline-ok')
        });
        const text = hasFlag(rest, '--json') ? JSON.stringify(report, null, 2) : formatCheckReport(report);
        console.log(text);
        return report.ok ? 0 : 1;
      }
      case 'replay': {
        if (!target) throw new Error('replay requires <dir>');
        const port = Number(readOption(rest, '--port', '4177'));
        const host = readOption(rest, '--host', '127.0.0.1');
        await startReplayServer({ dir: target, port, host });
        console.log(`fetchfreeze replay listening on http://${host}:${port}`);
        return await new Promise(() => undefined);
      }
      case 'map': {
        if (!target) throw new Error('map requires <dir>');
        const routes = await buildRouteMap(target, readOption(rest, '--base-url'));
        console.log(hasFlag(rest, '--pretty') ? JSON.stringify(routes, null, 2) : JSON.stringify(routes));
        return 0;
      }
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

function formatCheckReport(report: Awaited<ReturnType<typeof checkPack>>): string {
  const summary = report.ok ? `OK: ${report.recordCount} fixture(s) checked` : `FAIL: ${report.issues.length} issue(s) across ${report.recordCount} fixture(s)`;
  const details = report.issues.map((issue) => `${issue.level.toUpperCase()} ${issue.code}${issue.recordId ? ` ${issue.recordId}` : ''}: ${issue.message}`);
  return [summary, ...details].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await main();
}
