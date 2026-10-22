import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const routes = ['suite', 'suite/suite-baia', 'suite/suite-giardino', 'suite/suite-panorama', 'spiaggia', 'spa', 'fitness', 'ristorante', 'esperienze', 'galleria', 'contatti'];
const html = await readFile('dist/index.html', 'utf8');
assert.match(html, /<html lang="it">/);
assert.match(html, /noindex,nofollow/);
assert.match(html, /MEMENTO/);
for (const route of routes) { const page=await readFile(`dist/${route}/index.html`,'utf8'); assert.match(page, /<h1[ >]/, `No prerendered heading: ${route}`); assert.match(page, /id="root"/); assert.notEqual(page,html, `Route content not rendered: ${route}`); }
assert.match(html, /Il mare\./);
assert.match(html, /id="camere"/);
assert.match(html, /id="giornata"/);
assert.match(html, /id="informazioni"/);
const urls = [...html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)].map(m => m[1]);
const sourceFiles = ['src/App.tsx', 'src/components/Shell.tsx', 'src/components/Booking.tsx', 'src/components/Content.tsx', 'src/components/Primitives.tsx'];
for (const source of sourceFiles) {
  const text = await readFile(source, 'utf8');
  urls.push(...[...text.matchAll(/(?:src|href)="(\/assets\/[^"#?]+)"/g)].map(m => m[1]));
  assert.doesNotMatch(text, /alert\(|mailto:|tel:/, `Unexpected fake contact or alert: ${source}`);
}
for (const url of new Set(urls)) {
  const info = await stat(join('dist', url));
  assert(info.isFile() || (info.isDirectory() && (await stat(join('dist', url, 'index.html'))).isFile()), `Missing asset or route ${url}`);
}
for (const width of [768,1536]) assert((await stat(`dist/assets/photos/summer-hero-${width}.webp`)).isFile());
const files = await readdir('dist/assets');
let jsGzip = 0, cssGzip = 0;
for (const name of files) {
  if (!name.endsWith('.js') && !name.endsWith('.css')) continue;
  const compressed = gzipSync(await readFile(join('dist/assets', name))).length;
  if (name.endsWith('.js')) jsGzip += compressed; else cssGzip += compressed;
}
const mediaManifest = JSON.parse(await readFile('src/data/assets.json', 'utf8'));
assert.equal(mediaManifest.runtime.photos.length,9);
for (const photo of mediaManifest.runtime.photos) for (const url of photo.sources) assert((await stat(join('dist',url))).isFile(), `Missing generated photo: ${url}`);
const output = { directRoutes: routes.length, referencedAssets: new Set(urls).size, jsGzipBytes: jsGzip, cssGzipBytes: cssGzip, generatedPhotos: mediaManifest.runtime.photos.length, browserQA: 'Desktop hero and anchor observed. Room-image fallback observed; further browser testing blocked by URL policy.' };
console.log(JSON.stringify(output, null, 2));
