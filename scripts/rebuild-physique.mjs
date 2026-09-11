import { readFile, writeFile } from 'node:fs/promises';

const parts = Array.from({ length: 10 }, (_, i) =>
  new URL(`../assets/physique-b64/part${String(i + 1).padStart(2, '0')}.txt`, import.meta.url)
);

const base64 = (await Promise.all(parts.map((file) => readFile(file, 'utf8'))))
  .join('')
  .replace(/\s+/g, '');

const output = new URL('../assets/greg-kafalian-physique.v2.jpg', import.meta.url);
await writeFile(output, Buffer.from(base64, 'base64'));

console.log(`Rebuilt physique JPEG: ${Buffer.from(base64, 'base64').length} bytes`);
