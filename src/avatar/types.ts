export type LayerSlot =
  | 'background' | 'body' | 'ears' | 'hairBack' | 'face' | 'eyesBase'
  | 'eyesColor' | 'eyebrows' | 'mouth' | 'outfit' | 'neckAccessory'
  | 'sash' | 'sashHonors' | 'hairFront' | 'glasses' | 'headwear'
  | 'accessory' | 'foregroundEffect';

export type ColorRole = 'skinTone' | 'hairColor' | 'eyeColor' | 'outfitColor';

export interface AvatarLayerDefinition {
  slot: LayerSlot;
  src: string;
  tint?: ColorRole;
}

export interface AvatarItem {
  id: string;
  name: string;
  thumbnail?: string;
  layers: AvatarLayerDefinition[];
  colors?: string[];
  tags?: string[];
  requiresTags?: string[];
  incompatibleTags?: string[];
  incompatibleWith?: string[];
  unlocked?: boolean;
  nullable?: boolean;
}

export interface AvatarCategory {
  id: string;
  label: string;
  icon: string;
  selectionKey: AvatarSelectionKey;
  colorKey?: ColorRole;
  items: AvatarItem[];
}

export interface AvatarManifest {
  version: number;
  canvas: { width: number; height: number };
  layerOrder: LayerSlot[];
  palettes: Record<ColorRole, Record<string, string>>;
  categories: AvatarCategory[];
}

export type AvatarSelectionKey =
  | 'background' | 'body' | 'face' | 'eyes' | 'eyebrows' | 'mouth'
  | 'hair' | 'outfit' | 'neckAccessory' | 'sash' | 'glasses'
  | 'headwear' | 'accessory' | 'effect';

export interface AvatarConfig {
  version: 1;
  background: string | null;
  body: string;
  face: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  hair: string;
  outfit: string;
  neckAccessory: string | null;
  sash: string | null;
  glasses: string | null;
  headwear: string | null;
  accessory: string | null;
  effect: string | null;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  outfitColor: string;
  honors: string[];
}

export interface AvatarStorageAdapter {
  loadAvatar(): AvatarConfig | null;
  saveAvatar(config: AvatarConfig): void;
  deleteAvatar(): void;
}

export interface AvatarCreatorProps {
  initialAvatar?: AvatarConfig;
  unlockedItemIds?: string[];
  storage?: AvatarStorageAdapter;
  onChange?: (avatar: AvatarConfig) => void;
  onSave?: (avatar: AvatarConfig) => void;
}
