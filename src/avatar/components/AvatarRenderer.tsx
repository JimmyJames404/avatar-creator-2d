import { memo } from 'react';
import { resolveLayers } from '../avatarEngine';
import { avatarManifest } from '../avatarManifest';
import type { AvatarConfig } from '../types';
import { assetUrl } from '../assetUrl';

export interface AvatarRendererProps {
  avatar: AvatarConfig;
  className?: string;
  title?: string;
}

export const AvatarRenderer = memo(function AvatarRenderer({ avatar, className = '', title = 'Avatar personalizado' }: AvatarRendererProps) {
  const layers = resolveLayers(avatar);
  return (
    <div
      className={`avatar-renderer ${className}`}
      role="img"
      aria-label={title}
      data-testid="avatar-renderer"
      style={{ aspectRatio: `${avatarManifest.canvas.width}/${avatarManifest.canvas.height}` }}
    >
      {layers.map((layer) => layer.color ? (
        <div
          className="avatar-layer avatar-mask"
          data-layer={layer.slot}
          data-item={layer.itemId}
          key={`${layer.itemId}-${layer.slot}`}
          style={{
            backgroundColor: layer.color,
            WebkitMaskImage: `url(${assetUrl(layer.src)})`, maskImage: `url(${assetUrl(layer.src)})`,
          }}
        />
      ) : (
        <img
          className="avatar-layer"
          data-layer={layer.slot}
          data-item={layer.itemId}
          key={`${layer.itemId}-${layer.slot}`}
          src={assetUrl(layer.src)}
          alt=""
          draggable={false}
          loading="eager"
        />
      ))}
      {avatar.sash && avatar.honors.length > 0 && (
        <div className="honor-slots" aria-hidden="true">
          {avatar.honors.slice(0, 4).map((honor, index) => <i key={`${honor}-${index}`} title={honor} />)}
        </div>
      )}
    </div>
  );
});
