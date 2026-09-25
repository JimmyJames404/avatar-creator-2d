import { useEffect } from 'react';
import { isItemUnlocked } from '../avatarCompatibility';
import type { AvatarItem } from '../types';
import { assetUrl } from '../assetUrl';

function isSelected(item: AvatarItem, value: string | null) {
  return item.id === value || (value === null && item.nullable === true);
}

export function AvatarItemSelector({ items, value, unlockedItemIds, onChange }: { items: AvatarItem[]; value: string | null; unlockedItemIds?: string[]; onChange: (item: AvatarItem) => void }) {
  const selectedIndex = Math.max(0, items.findIndex((item) => isSelected(item, value)));
  const move = (direction: -1 | 1) => {
    for (let step = 1; step <= items.length; step += 1) {
      const next = items[(selectedIndex + direction * step + items.length) % items.length];
      if (isItemUnlocked(next, unlockedItemIds)) { onChange(next); return; }
    }
  };

  useEffect(() => {
    const candidates = [items[(selectedIndex - 1 + items.length) % items.length], items[(selectedIndex + 1) % items.length]];
    candidates.forEach((item) => item?.layers.forEach((layer) => { const image = new Image(); image.src = assetUrl(layer.src); }));
  }, [items, selectedIndex]);

  return (
    <div className="item-selector">
      <div className="stepper">
        <button className="icon-button" onClick={() => move(-1)} aria-label="Opción anterior">‹</button>
        <div><strong>{items[selectedIndex]?.name}</strong><span>{String(selectedIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span></div>
        <button className="icon-button" onClick={() => move(1)} aria-label="Opción siguiente">›</button>
      </div>
      <div className="item-grid" role="listbox" aria-label="Opciones disponibles">
        {items.map((item, index) => {
          const unlocked = isItemUnlocked(item, unlockedItemIds);
          const selected = isSelected(item, value);
          return (
            <button key={item.id} role="option" aria-selected={selected} aria-label={`${item.name}${unlocked ? '' : ', bloqueado'}`} disabled={!unlocked} className={`item-card ${selected ? 'is-active' : ''}`} onClick={() => onChange(item)}>
              <span className="item-number">{String(index + 1).padStart(2, '0')}</span>
              <img src={assetUrl(item.thumbnail || item.layers[0]?.src)} alt="" loading="lazy" />
              {!unlocked && <span className="lock-badge" aria-hidden="true">🔒</span>}
              {selected && <span className="check-badge" aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
