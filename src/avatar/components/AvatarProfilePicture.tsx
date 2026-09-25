import { AvatarRenderer } from './AvatarRenderer';
import type { AvatarConfig } from '../types';

export function AvatarProfilePicture({ avatar, shape = 'circle', size = 96 }: { avatar: AvatarConfig; shape?: 'circle' | 'square'; size?: number }) {
  return (
    <div className={`profile-picture profile-picture--${shape}`} style={{ width: size, height: size }}>
      <AvatarRenderer avatar={avatar} title={`Vista de perfil ${shape === 'circle' ? 'circular' : 'cuadrada'}`} />
    </div>
  );
}
