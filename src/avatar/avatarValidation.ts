import type { AvatarManifest } from './types';

export function validateManifestStructure(manifest: AvatarManifest): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const validSlots = new Set(manifest.layerOrder);
  const allItems = manifest.categories.flatMap((category) => category.items);
  for (const item of allItems) {
    if (ids.has(item.id)) errors.push(`ID duplicado: ${item.id}`);
    ids.add(item.id);
    if (!item.layers.length && !item.nullable) errors.push(`Item sin capas: ${item.id}`);
    for (const layer of item.layers) {
      if (!validSlots.has(layer.slot)) errors.push(`Capa desconocida ${layer.slot} en ${item.id}`);
    }
  }
  for (const item of allItems) {
    for (const id of item.incompatibleWith ?? []) {
      if (!ids.has(id)) errors.push(`Referencia incompatible inválida ${id} en ${item.id}`);
    }
  }
  return errors;
}

export function validateAssetReferences(manifest: AvatarManifest, exists: (path: string) => boolean): string[] {
  const errors: string[] = [];
  for (const category of manifest.categories) {
    for (const item of category.items) {
      if (item.thumbnail && !exists(item.thumbnail)) errors.push(`Thumbnail inexistente: ${item.thumbnail}`);
      for (const layer of item.layers) {
        if (!exists(layer.src)) errors.push(`Asset inexistente: ${layer.src}`);
      }
    }
  }
  return errors;
}
