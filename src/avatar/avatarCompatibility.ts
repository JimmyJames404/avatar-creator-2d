import { avatarManifest, getItem } from './avatarManifest';
import type { AvatarConfig, AvatarItem, AvatarSelectionKey } from './types';

export function selectedItems(config: AvatarConfig): AvatarItem[] {
  return avatarManifest.categories
    .map((category) => getItem(config[category.selectionKey] as string | null))
    .filter((item): item is AvatarItem => Boolean(item));
}

export function isItemUnlocked(item: AvatarItem, unlockedItemIds?: string[]): boolean {
  if (item.unlocked !== false) return true;
  return unlockedItemIds?.includes(item.id) ?? false;
}

export function isItemCompatible(
  item: AvatarItem,
  config: AvatarConfig,
  replacingKey?: AvatarSelectionKey,
): boolean {
  const others = selectedItems(config).filter((other) => {
    if (other.id === item.id) return false;
    if (!replacingKey) return true;
    return getItem(config[replacingKey] as string | null)?.id !== other.id;
  });
  const ids = new Set(others.map((other) => other.id));
  const tags = new Set(others.flatMap((other) => other.tags ?? []));
  if (item.incompatibleWith?.some((id) => ids.has(id))) return false;
  if (item.incompatibleTags?.some((tag) => tags.has(tag))) return false;
  if (item.requiresTags?.some((tag) => !tags.has(tag))) return false;
  return !others.some((other) =>
    other.incompatibleWith?.includes(item.id)
    || other.incompatibleTags?.some((tag) => item.tags?.includes(tag)),
  );
}

export function compatibleItems(
  key: AvatarSelectionKey,
  config: AvatarConfig,
  unlockedItemIds?: string[],
): AvatarItem[] {
  const category = avatarManifest.categories.find((entry) => entry.selectionKey === key);
  return category?.items.filter((item) =>
    isItemUnlocked(item, unlockedItemIds) && isItemCompatible(item, config, key),
  ) ?? [];
}
