import { AvatarRenderer } from './AvatarRenderer';
import type { AvatarConfig } from '../types';

export function AvatarPreview({ avatar, shape, onShapeChange }: { avatar: AvatarConfig; shape: 'circle' | 'square'; onShapeChange: (shape: 'circle' | 'square') => void }) {
  return (
    <section className="preview-panel" aria-label="Vista previa del avatar">
      <div className="preview-topline"><span className="eyebrow">VISTA PREVIA</span><span className="live-dot">EN VIVO</span></div>
      <div className={`preview-stage preview-stage--${shape}`}><AvatarRenderer avatar={avatar} /></div>
      <div className="shape-toggle" role="group" aria-label="Forma de la foto de perfil">
        <button className={shape === 'circle' ? 'is-active' : ''} onClick={() => onShapeChange('circle')} aria-pressed={shape === 'circle'}><span className="shape-icon circle" /> Circular</button>
        <button className={shape === 'square' ? 'is-active' : ''} onClick={() => onShapeChange('square')} aria-pressed={shape === 'square'}><span className="shape-icon" /> Cuadrada</button>
      </div>
    </section>
  );
}
