import manifestJson from './avatar-manifest.json';
import type { AvatarCategory, AvatarItem, AvatarManifest, AvatarSelectionKey } from './types';

export const avatarManifest = manifestJson as AvatarManifest;

export function getCategory(id: string): AvatarCategory | undefined {
  return avatarManifest.categories.find((category) => category.id === id);
}

export function getCategoryBySelectionKey(key: AvatarSelectionKey): AvatarCategory | undefined {
  return avatarManifest.categories.find((category) => category.selectionKey === key);
}

export function getItem(id: string | null): AvatarItem | undefined {
  if (!id) return undefined;
  return avatarManifest.categories.flatMap((category) => category.items).find((item) => item.id === id);
}
