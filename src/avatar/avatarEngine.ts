import { avatarManifest, getCategoryBySelectionKey, getItem } from './avatarManifest';
import { isItemCompatible } from './avatarCompatibility';
import type { AvatarConfig, AvatarLayerDefinition, AvatarSelectionKey, ColorRole } from './types';

export const DEFAULT_AVATAR: AvatarConfig = {
  version: 1,
  background: 'background-sunrise', body: 'body-01', face: 'face-round',
  eyes: 'eyes-bright', eyebrows: 'brows-soft', mouth: 'mouth-smile', hair: 'hair-swoop',
  outfit: 'outfit-adventure', neckAccessory: 'neck-scarf', sash: 'sash-sky',
  glasses: null, headwear: null, accessory: 'accessory-bracelet', effect: null,
  skinTone: 'warm', eyeColor: 'brown', hairColor: 'espresso', outfitColor: 'teal', honors: [],
};

export interface ResolvedLayer extends AvatarLayerDefinition {
  itemId: string;
  color?: string;
}

export function resolveLayers(config: AvatarConfig): ResolvedLayer[] {
  const layers: ResolvedLayer[] = [];
  for (const category of avatarManifest.categories) {
    const item = getItem(config[category.selectionKey] as string | null);
    if (!item) continue;
    for (const layer of item.layers) {
      layers.push({
        ...layer,
        itemId: item.id,
        color: layer.tint ? resolveColor(layer.tint, config[layer.tint]) : undefined,
      });
    }
  }
  return layers.sort((a, b) => avatarManifest.layerOrder.indexOf(a.slot) - avatarManifest.layerOrder.indexOf(b.slot));
}

export function resolveColor(role: ColorRole, colorId: string): string {
  return avatarManifest.palettes[role]?.[colorId] ?? '#64748b';
}

export function setAvatarItem(config: AvatarConfig, key: AvatarSelectionKey, itemId: string | null): AvatarConfig {
  const category = getCategoryBySelectionKey(key);
  if (!category) return config;
  const item = itemId ? category.items.find((entry) => entry.id === itemId) : undefined;
  if (itemId && (!item || !isItemCompatible(item, config, key))) return config;
  return { ...config, [key]: itemId };
}

export function normalizeAvatar(input: unknown): AvatarConfig {
  const source = typeof input === 'object' && input ? input as Omit<Partial<AvatarConfig>, 'version'> & { version?: number } : {};
  const migrated = Number(source.version) === 0
    ? { ...source, version: 1, honors: source.honors ?? [] }
    : source;
  const result = { ...DEFAULT_AVATAR, ...migrated, version: 1 } as AvatarConfig;
  for (const category of avatarManifest.categories) {
    const value = result[category.selectionKey] as string | null;
    if (value === null && category.items.some((item) => item.nullable)) continue;
    if (!category.items.some((item) => item.id === value)) {
      (result as unknown as Record<string, unknown>)[category.selectionKey] = category.items[0]?.id ?? null;
    }
  }
  return result;
}

export function isValidAvatar(config: unknown): config is AvatarConfig {
  if (!config || typeof config !== 'object') return false;
  const normalized = normalizeAvatar(config);
  return JSON.stringify(normalized) === JSON.stringify(config);
}
