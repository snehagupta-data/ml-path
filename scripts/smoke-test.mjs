// Smoke test for the ML Path production build.
// Usage: npm run build && node scripts/smoke-test.mjs [port]
//   (defaults to port 4173; start `npm run preview -- --port 4173` first,
//   or run `npm run smoke` which does build + preview + test.)
//
// Checks:
//  1. dist/ exists with index.html and hashed JS assets.
//  2. Every app route returns 200 from the preview server (SPA fallback).
//  3. Dataset CSVs are served.
//  4. The built JS bundle contains no obvious placeholder markers.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2] ?? 4173);
const base = `http://127.0.0.1:${port}`;

const ROUTES = [
  '/',
  '/roadmap',
  '/modules',
  '/modules/m1',
  '/lesson/m1-what-is-ml',
  '/diagnostic',
  '/practice',
  '/revision',
  '/mistakes',
  '/coding',
  '/coding/ch-numpy-basics',
  '/visuals',
  '/interview',
  '/interview/trainer',
  '/interview/mock',
  '/projects',
  '/projects/churn',
  '/datasets',
  '/datasets/churn',
  '/debug-lab',
  '/cases',
  '/notes',
  '/analytics',
  '/settings',
];

const DATA_FILES = ['/data/churn.csv', '/data/loan.csv', '/data/housing.csv', '/data/ecommerce.csv'];

let failures = 0;
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures += 1;
}

async function get(path) {
  const res = await fetch(base + path, { redirect: 'follow' });
  return { status: res.status, text: await res.text() };
}

// 1. Build output
const dist = join(root, 'dist');
check('dist/ exists', existsSync(dist));
check('dist/index.html exists', existsSync(join(dist, 'index.html')));
const assetsDir = join(dist, 'assets');
let jsFiles = [];
if (existsSync(assetsDir)) {
  jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
}
check('JS bundles emitted', jsFiles.length > 0, `${jsFiles.length} chunks`);

// 2. Routes return 200 with the SPA shell
for (const route of ROUTES) {
  try {
    const { status, text } = await get(route);
    const isShell = text.includes('<div id="root">') || text.includes('id="root"');
    check(`GET ${route}`, status === 200 && isShell, `status ${status}`);
  } catch (err) {
    check(`GET ${route}`, false, `fetch failed: ${err.message}`);
  }
}

// 3. Dataset files served
for (const file of DATA_FILES) {
  try {
    const { status, text } = await get(file);
    const lines = text.trim().split('\n').length;
    check(`GET ${file}`, status === 200 && lines > 50, `status ${status}, ${lines} lines`);
  } catch (err) {
    check(`GET ${file}`, false, `fetch failed: ${err.message}`);
  }
}

// 4. No placeholder markers in the built bundle
if (jsFiles.length > 0) {
  const bundle = jsFiles.map((f) => readFileSync(join(assetsDir, f), 'utf8')).join('\n');
  // NOTE: "TODO" inside challenge starter code is legitimate learner-facing
  // instruction, so it is deliberately NOT in this list.
  const banned = ['Lorem ipsum', 'Coming soon — placeholder', 'TODO: implement this page'];
  for (const marker of banned) {
    check(`bundle has no "${marker}"`, !bundle.includes(marker));
  }
  check('bundle mentions curriculum content', bundle.includes('Overfitting') || bundle.includes('overfitting'));
}

console.log(failures === 0 ? '\nAll smoke tests passed.' : `\n${failures} smoke test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
