import { readFile, writeFile } from 'node:fs/promises';

const indexFile = new URL('../index.html', import.meta.url);
let html = await readFile(indexFile, 'utf8');

html = html.replaceAll(
  '/assets/greg-kafalian-physique.v1.webp',
  '/assets/greg-kafalian-physique-clean.v1.jpg?v=1'
);

await writeFile(indexFile, html, 'utf8');
