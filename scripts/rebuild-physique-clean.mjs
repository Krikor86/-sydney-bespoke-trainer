import { readFile, writeFile } from 'node:fs/promises';

const part1 = await readFile(new URL('../assets/physique-clean2-b64/part01.txt', import.meta.url), 'utf8');
const part2 = await readFile(new URL('../assets/physique-clean2-b64/part02.txt', import.meta.url), 'utf8');
const base64 = `${part1}${part2}`.replace(/\s+/g, '');
const bytes = Buffer.from(base64, 'base64');

await writeFile(
  new URL('../assets/greg-kafalian-physique-clean.v1.jpg', import.meta.url),
  bytes
);
