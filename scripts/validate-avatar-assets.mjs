import { readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'src', 'avatar', 'avatar-manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const errors = [];
const ids = new Set();
const validSlots = new Set(manifest.layerOrder);
const allItems = manifest.categories.flatMap((category) => category.items);

for (const item of allItems) {
  if (ids.has(item.id)) errors.push(`ID duplicado: ${item.id}`);
  ids.add(item.id);
  if (!item.layers.length && !item.nullable) errors.push(`Item sin capas: ${item.id}`);
  for (const layer of item.layers) {
    if (!validSlots.has(layer.slot)) errors.push(`Capa desconocida "${layer.slot}" en ${item.id}`);
    if (layer.tint && !manifest.palettes[layer.tint]) errors.push(`Paleta desconocida "${layer.tint}" en ${item.id}`);
  }
}

for (const item of allItems) {
  for (const id of item.incompatibleWith ?? []) if (!ids.has(id)) errors.push(`Referencia incompatible inválida "${id}" en ${item.id}`);
}

async function checkAsset(url, label) {
  const diskPath = join(root, 'public', url.replace(/^\//, ''));
  try {
    await stat(diskPath);
    if (diskPath.endsWith('.svg')) {
      const source = await readFile(diskPath, 'utf8');
      const viewBox = source.match(/viewBox=["']([^"']+)["']/)?.[1];
      if (!viewBox) errors.push(`${label} SVG sin viewBox: ${url}`);
      if (label === 'Asset' && viewBox !== `${manifest.canvas.width === 512 ? '0 0 512 512' : ''}`) {
        errors.push(`${label} con canvas inesperado (${viewBox ?? 'ninguno'}): ${url}`);
      }
    }
  } catch { errors.push(`${label} inexistente: ${url}`); }
}

await Promise.all(allItems.flatMap((item) => [
  ...(item.thumbnail ? [checkAsset(item.thumbnail, 'Thumbnail')] : []),
  ...item.layers.map((layer) => checkAsset(layer.src, 'Asset')),
]));

if (errors.length) {
  console.error(`Avatar manifest inválido (${errors.length} errores):`);
  errors.sort().forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(`Avatar manifest válido: ${manifest.categories.length} categorías, ${allItems.length} items, canvas ${manifest.canvas.width}×${manifest.canvas.height}.`);
