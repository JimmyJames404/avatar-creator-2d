import { avatarManifest } from '../avatarManifest';
import type { ColorRole } from '../types';

export function AvatarColorSelector({ role, colors, value, onChange }: { role: ColorRole; colors: string[]; value: string; onChange: (value: string) => void }) {
  const palette = avatarManifest.palettes[role];
  return (
    <div className="color-section">
      <span className="control-label">Color</span>
      <div className="color-list" role="radiogroup" aria-label="Color">
        {colors.map((color) => <button key={color} role="radio" aria-checked={value === color} aria-label={color} className={value === color ? 'is-active' : ''} style={{ '--swatch': palette[color] } as React.CSSProperties} onClick={() => onChange(color)} />)}
      </div>
    </div>
  );
}
