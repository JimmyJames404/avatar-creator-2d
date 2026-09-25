import { avatarManifest } from './avatarManifest';
import { compatibleItems } from './avatarCompatibility';
import type { AvatarConfig, AvatarSelectionKey } from './types';

const pick = <T,>(values: T[], random: () => number): T | undefined => values[Math.floor(random() * values.length)];

export function randomizeCategory(
  config: AvatarConfig,
  key: AvatarSelectionKey,
  unlockedItemIds?: string[],
  random: () => number = Math.random,
): AvatarConfig {
  const options = compatibleItems(key, config, unlockedItemIds);
  const item = pick(options, random);
  if (!item) return config;
  const category = avatarManifest.categories.find((entry) => entry.selectionKey === key);
  const next = { ...config, [key]: item.nullable ? null : item.id } as AvatarConfig;
  if (category?.colorKey && item.colors?.length) {
    next[category.colorKey] = pick(item.colors, random) ?? next[category.colorKey];
  }
  return next;
}

export function randomizeAvatar(
  config: AvatarConfig,
  unlockedItemIds?: string[],
  random: () => number = Math.random,
): AvatarConfig {
  return avatarManifest.categories.reduce(
    (current, category) => randomizeCategory(current, category.selectionKey, unlockedItemIds, random),
    { ...config },
  );
}
