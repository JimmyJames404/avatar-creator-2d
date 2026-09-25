import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AvatarRenderer } from './components/AvatarRenderer';
import { DEFAULT_AVATAR, isValidAvatar, normalizeAvatar, resolveLayers, setAvatarItem } from './avatarEngine';
import { randomizeAvatar, randomizeCategory } from './avatarRandomizer';
import { isItemCompatible } from './avatarCompatibility';
import { avatarManifest, getItem } from './avatarManifest';
import { LocalAvatarStorageAdapter } from './avatarStorage';
import { validateAssetReferences, validateManifestStructure } from './avatarValidation';
import type { AvatarManifest } from './types';

describe('Avatar engine', () => {
  it('renderiza una configuración válida', () => {
    expect(isValidAvatar(DEFAULT_AVATAR)).toBe(true);
    expect(resolveLayers(DEFAULT_AVATAR).length).toBeGreaterThan(8);
  });

  it('cambia el cabello', () => {
    const next = setAvatarItem(DEFAULT_AVATAR, 'hair', 'hair-bob');
    expect(next.hair).toBe('hair-bob');
    expect(resolveLayers(next).filter((layer) => layer.itemId === 'hair-bob')).toHaveLength(2);
  });

  it('cambia los ojos', () => {
    const next = setAvatarItem(DEFAULT_AVATAR, 'eyes', 'eyes-calm');
    expect(next.eyes).toBe('eyes-calm');
  });

  it('cambia un color sin alterar la pieza', () => {
    const next = { ...DEFAULT_AVATAR, hairColor: 'violet' };
    const layers = resolveLayers(next).filter((layer) => layer.itemId === next.hair);
    expect(layers.every((layer) => layer.color === '#7257c8')).toBe(true);
  });

  it('genera un avatar aleatorio válido', () => {
    const next = randomizeAvatar(DEFAULT_AVATAR, undefined, () => 0.6);
    expect(isValidAvatar(next)).toBe(true);
  });

  it('el randomizador nunca selecciona un item bloqueado', () => {
    const next = randomizeCategory(DEFAULT_AVATAR, 'accessory', undefined, () => 0.999);
    expect(next.accessory).not.toBe('accessory-compass');
  });

  it('respeta restricciones de compatibilidad por tags', () => {
    const cap = getItem('headwear-cap')!;
    const withPonytail = { ...DEFAULT_AVATAR, hair: 'hair-ponytail' };
    expect(isItemCompatible(cap, withPonytail, 'headwear')).toBe(false);
  });

  it('guarda y carga la misma configuración', () => {
    const storage = new LocalAvatarStorageAdapter('test-avatar');
    storage.saveAvatar({ ...DEFAULT_AVATAR, hair: 'hair-curls' });
    expect(storage.loadAvatar()?.hair).toBe('hair-curls');
    storage.deleteAvatar();
    expect(storage.loadAvatar()).toBeNull();
  });

  it('repara una configuración inválida', () => {
    const next = normalizeAvatar({ ...DEFAULT_AVATAR, eyes: 'no-existe' });
    expect(next.eyes).toBe('eyes-bright');
    expect(isValidAvatar({ ...DEFAULT_AVATAR, eyes: 'no-existe' })).toBe(false);
  });

  it('detecta IDs duplicados en el manifest', () => {
    const duplicate = structuredClone(avatarManifest) as AvatarManifest;
    duplicate.categories[1].items[0].id = duplicate.categories[0].items[0].id;
    expect(validateManifestStructure(duplicate).some((error) => error.includes('duplicado'))).toBe(true);
  });

  it('detecta assets inexistentes', () => {
    const errors = validateAssetReferences(avatarManifest, (path) => path !== '/avatar/body/body.svg');
    expect(errors).toContain('Asset inexistente: /avatar/body/body.svg');
  });

  it('migra una configuración versión 0', () => {
    const legacy = { ...DEFAULT_AVATAR, version: 0, honors: undefined };
    const migrated = normalizeAvatar(legacy);
    expect(migrated.version).toBe(1);
    expect(migrated.honors).toEqual([]);
  });
});

describe('AvatarRenderer independiente', () => {
  it('funciona sin montar AvatarCreator', () => {
    render(<AvatarRenderer avatar={DEFAULT_AVATAR} />);
    expect(screen.getByTestId('avatar-renderer')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-renderer').querySelectorAll('[data-layer]').length).toBeGreaterThan(8);
  });
});
