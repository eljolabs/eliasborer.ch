import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const base = `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const site = process.env.SITE_URL || 'https://eliasborer.ch';
const home = await readFile(new URL('index.html', root), 'utf8');
assert.ok(home.includes('Military leadership experience'));
assert.ok(home.includes('Platoon Commander'));
assert.ok(home.includes('internships and junior roles'));
assert.ok(home.includes('Diversification Lab'));
assert.ok(home.includes('Hypothetical model'));
assert.ok(home.includes(new URL(base, site).href));
const alias = await readFile(new URL('portfolio-risk/index.html', root), 'utf8');
assert.ok(alias.includes('noindex, follow'));
assert.ok(alias.includes(new URL(base, site).href));
await access(new URL('privacy/index.html', root));
if (process.env.PUBLIC_HOSTING_PROVIDER === 'github-pages') {
  const privacy = await readFile(new URL('privacy/index.html', root), 'utf8');
  assert.ok(privacy.includes('The website is hosted by GitHub Pages.'), 'Wrong hosting privacy notice');
}
await access(new URL('404.html', root));
await access(new URL('robots.txt', root));
await access(new URL('sitemap.xml', root));
await access(new URL('licenses/inter.txt', root));
await access(new URL('licenses/ibm-plex-mono.txt', root));
for (const old of ['animated', 'snb-research', 'swiss-market', 'swiss-structure.jpg', 'data/portfolio-swiss-annual.json', 'data/portfolio-annual.json', 'data/snb-results.json', 'data/eur-chf-2025.json']) {
  await assert.rejects(access(new URL(old, root)), `Archived asset leaked into dist: ${old}`);
}
const files = await readdir(root, {recursive: true});
let fonts = 0;
for (const file of files) {
  assert.ok(!/(^|\/)\.|\.(?:bundle|map|pem|key)$/.test(file), `Private or debug artifact: ${file}`);
  if (file.endsWith('.woff2')) fonts++;
  if (!/\.(html|css|js)$/.test(file)) continue;
  const text = await readFile(new URL(file, root), 'utf8');
  assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(text), `Remote font reference: ${file}`);
  assert.ok(!/CHSPI|CSBGC7|portfolio-swiss-annual|snbgwdzid/.test(text), `Historical data reference: ${file}`);
  if (!file.endsWith('.html')) continue;
  for (const match of text.matchAll(/(?:src|href)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const url = match[1];
    assert.ok(url.startsWith(base), `Wrong base path: ${url} in ${file}`);
    const relative = decodeURIComponent(url.slice(base.length));
    const target = relative.endsWith('/') || relative === '' ? `${relative}index.html` : relative;
    await access(new URL(target, root));
  }
}
assert.ok(fonts >= 3, 'Expected locally bundled fonts');
console.log(`PASS: release routes, local assets/fonts, canonical URL, base ${base}, no archived artifacts.`);
