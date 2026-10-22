import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

// A static pre-render audit, not browser or assistive-technology certification.
const routes = ['/', '/suite', '/suite/suite-baia', '/suite/suite-giardino', '/suite/suite-panorama', '/spiaggia', '/spa', '/fitness', '/ristorante', '/esperienze', '/galleria', '/contatti'];
const documents = new Map();
const allAssets = new Set();
let internalLinks = 0;
let images = 0;
function tags(html, name = '[a-z][a-z0-9-]*') { return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]); }
function attr(tag, name) { return tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, 'i'))?.[1]; }
function decode(value) { return value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"'); }

for (const route of routes) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  const allTags = tags(html);
  const ids = allTags.map(tag => attr(tag, 'id')).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs in ${route}`);
  assert.equal(tags(html, 'h1').length, 1, `Each rendered route needs exactly one H1: ${route}`);
  assert(tags(html, 'main').some(tag => attr(tag, 'id') === 'main-content'), `Missing main landmark: ${route}`);
  assert(html.includes('Hotel immaginario') && html.includes('Fotografie generate'), `Missing visible concept disclosure: ${route}`);
  for (const tag of allTags) for (const name of ['aria-controls', 'aria-labelledby', 'aria-describedby']) {
    for (const id of (attr(tag, name) || '').split(/\s+/).filter(Boolean)) assert(ids.includes(id), `${name} references missing ID ${id} on ${route}`);
  }
  for (const tag of tags(html, 'img')) {
    images++;
    assert(attr(tag, 'alt') !== undefined, `Image has no alternative text attribute: ${route}`);
    assert(Number(attr(tag, 'width')) > 0 && Number(attr(tag, 'height')) > 0, `Image has no intrinsic dimensions: ${route}`);
    const src = attr(tag, 'src');
    if (src?.startsWith('/')) allAssets.add(decode(src));
    for (const entry of (attr(tag, 'srcSet') || '').split(',')) {
      const candidate = entry.trim().split(/\s+/)[0];
      if (candidate.startsWith('/')) allAssets.add(decode(candidate));
    }
  }
  documents.set(route, { html, ids: new Set(ids) });
}
for (const [route, { html }] of documents) {
  for (const tag of tags(html, 'a')) {
    const href = attr(tag, 'href');
    if (!href || (!href.startsWith('/') && !href.startsWith('#'))) continue;
    const url = new URL(decode(href), `https://preview.example.test${route}`);
    if (url.origin !== 'https://preview.example.test') continue;
    const path = url.pathname.replace(/\/$/, '') || '/';
    assert(documents.has(path), `Internal link points to an unbuilt page: ${route} -> ${href}`);
    if (url.hash) assert(documents.get(path).ids.has(decodeURIComponent(url.hash.slice(1))), `Broken fragment: ${route} -> ${href}`);
    internalLinks++;
  }
}
for (const asset of allAssets) assert((await stat(join('dist', asset))).isFile(), `Missing rendered image asset: ${asset}`);
for (const font of ['manrope', 'cormorant-garamond']) assert.match(await readFile(`dist/assets/fonts/${font}-OFL.txt`, 'utf8'), /SIL OPEN FONT LICENSE Version 1\.1/);
console.log(JSON.stringify({ prerenderedRoutes: routes.length, internalLinksChecked: internalLinks, imagesWithAltAndDimensions: images, uniqueImageAssets: allAssets.size, duplicateIds: 0, missingAriaTargets: 0, browserValidation: false }, null, 2));
