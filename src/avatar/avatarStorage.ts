import { normalizeAvatar } from './avatarEngine';
import type { AvatarConfig, AvatarStorageAdapter } from './types';

export class LocalAvatarStorageAdapter implements AvatarStorageAdapter {
  constructor(private readonly key = 'avatar-creator:config:v1') {}

  loadAvatar(): AvatarConfig | null {
    try {
      const value = localStorage.getItem(this.key);
      return value ? normalizeAvatar(JSON.parse(value)) : null;
    } catch { return null; }
  }

  saveAvatar(config: AvatarConfig): void {
    localStorage.setItem(this.key, JSON.stringify(config));
  }

  deleteAvatar(): void {
    localStorage.removeItem(this.key);
  }
}
