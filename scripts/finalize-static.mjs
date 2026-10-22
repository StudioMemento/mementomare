import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { render } from '../.ssr/entry-server.js';

export const routeTitles = {
 '/': 'Le ore del mare', '/suite': 'Le camere',
 '/suite/suite-baia': 'Camera Mare', '/suite/suite-giardino': 'Camera Pineta', '/suite/suite-panorama': 'Family Room',
 '/spiaggia': 'Mare e spiaggia', '/spa': 'Piscina e relax', '/fitness': 'Bici e dintorni',
 '/ristorante': 'A tavola', '/esperienze': 'Le esperienze', '/galleria': 'Galleria', '/contatti': 'Contatti e informazioni',
};
// React prerender emits the priority photograph's preload for each route.
let template = (await readFile('dist/index.html', 'utf8')).replace(/\s*<link rel="preload" as="image"[^>]*>/g, '');
// Optional custom domain, or Vercel's own deployment origin. No Sites dependency.
const originInput = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
if (originInput) {
 const url = new URL(originInput);
 if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('SITE_URL must be an HTTP(S) origin without credentials.');
 template = template.replace('content="/assets/photos/summer-pool-1536.webp"', `content="${url.origin}/assets/photos/summer-pool-1536.webp"`);
}
for (const [route,title] of Object.entries(routeTitles)) {
 const directory = join('dist',route);
 await mkdir(directory,{recursive:true});
 const html = template.replace('<div id="root"></div>',`<div id="root">${render(route)}</div>`).replace(/<title>.*?<\/title>/,`<title>${title} — MEMENTO · Hotel &amp; Beach</title>`);
 await writeFile(join(directory,'index.html'),html);
}
await writeFile('dist/404.html',template.replace('<div id="root"></div>',`<div id="root">${render('/pagina-non-trovata')}</div>`).replace(/<title>.*?<\/title>/,'<title>Pagina non trovata — MEMENTO</title>'));
await rm('dist/__qa.html',{force:true});
// Keep the earlier photographs in source, but ship only this edition's assets.
const manifest = JSON.parse(await readFile('src/data/assets.json', 'utf8'));
const usedPhotographs = new Set(manifest.runtime.photos.flatMap(photo => photo.sources));
for (const file of await readdir('dist/assets/photos')) {
 if (file.endsWith('.webp') && !usedPhotographs.has(`/assets/photos/${file}`)) await rm(join('dist/assets/photos',file));
}
console.log(`Prerendered ${Object.keys(routeTitles).length} routes and the 404 page.`);
