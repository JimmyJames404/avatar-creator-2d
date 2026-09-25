import { useMemo, useState } from 'react';
import { DEFAULT_AVATAR, normalizeAvatar, setAvatarItem } from '../avatarEngine';
import { avatarManifest, getItem } from '../avatarManifest';
import { randomizeAvatar, randomizeCategory } from '../avatarRandomizer';
import { LocalAvatarStorageAdapter } from '../avatarStorage';
import { exportAvatar } from '../avatarExport';
import type { AvatarConfig, AvatarCreatorProps, AvatarItem } from '../types';
import { AvatarCategoryTabs } from './AvatarCategoryTabs';
import { AvatarColorSelector } from './AvatarColorSelector';
import { AvatarItemSelector } from './AvatarItemSelector';
import { AvatarPreview } from './AvatarPreview';
import { AvatarRandomizer } from './AvatarRandomizer';

const defaultStorage = typeof window !== 'undefined' ? new LocalAvatarStorageAdapter() : undefined;

export function AvatarCreator({ initialAvatar, unlockedItemIds, storage = defaultStorage, onChange, onSave }: AvatarCreatorProps) {
  const [avatar, setAvatar] = useState<AvatarConfig>(() => normalizeAvatar(initialAvatar ?? storage?.loadAvatar() ?? DEFAULT_AVATAR));
  const [activeId, setActiveId] = useState('hair');
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [size, setSize] = useState<512 | 1024>(512);
  const [message, setMessage] = useState('');
  const category = avatarManifest.categories.find((entry) => entry.id === activeId) ?? avatarManifest.categories[0];
  const value = avatar[category.selectionKey] as string | null;
  const selected = useMemo(() => value ? getItem(value) : category.items.find((item) => item.nullable), [category.items, value]);

  const update = (next: AvatarConfig) => { setAvatar(next); onChange?.(next); };
  const chooseItem = (item: AvatarItem) => update(setAvatarItem(avatar, category.selectionKey, item.nullable ? null : item.id));
  const colorRole = category.colorKey;
  const colors = selected?.colors ?? (colorRole ? Object.keys(avatarManifest.palettes[colorRole]) : []);

  const save = () => {
    storage?.saveAvatar(avatar); onSave?.(avatar); setMessage('Avatar guardado en este dispositivo.');
    window.setTimeout(() => setMessage(''), 2400);
  };
  const doExport = async () => {
    try { await exportAvatar(avatar, format, size); setMessage(`Descarga ${format.toUpperCase()} lista.`); }
    catch { setMessage('No se pudo exportar. Inténtalo de nuevo.'); }
  };

  return (
    <main className="creator-shell">
      <header className="app-header">
        <a className="brand" href="#creator" aria-label="Avatar Lab, inicio"><span className="brand-mark">A</span><span>AVATAR <b>LAB</b></span></a>
        <span className="version-pill">MOTOR 2D · V1</span>
      </header>

      <section className="intro"><span className="eyebrow">PERSONAJE POR CAPAS</span><h1>Crea un avatar<br/><em>tan único como tú.</em></h1></section>

      <div id="creator" className="creator-grid">
        <AvatarPreview avatar={avatar} shape={shape} onShapeChange={setShape} />
        <section className="controls-panel" aria-label="Personalización">
          <div className="panel-heading"><div><span className="step-label">PASO 01</span><h2>Personaliza</h2></div><span className="selection-count">{avatarManifest.categories.indexOf(category) + 1} / {avatarManifest.categories.length}</span></div>
          <AvatarCategoryTabs categories={avatarManifest.categories} activeId={category.id} onChange={setActiveId} />
          <div className="category-heading"><div><span className="eyebrow">ELIGE TU</span><h3>{category.label}</h3></div><span className="category-icon" aria-hidden="true">{category.icon}</span></div>
          <AvatarItemSelector items={category.items} value={value} unlockedItemIds={unlockedItemIds} onChange={chooseItem} />
          {colorRole && colors.length > 0 && <AvatarColorSelector role={colorRole} colors={colors} value={avatar[colorRole]} onChange={(color) => update({ ...avatar, [colorRole]: color } as AvatarConfig)} />}
          <AvatarRandomizer
            onCategory={() => update(randomizeCategory(avatar, category.selectionKey, unlockedItemIds))}
            onAll={() => update(randomizeAvatar(avatar, unlockedItemIds))}
          />
          <div className="save-row">
            <button className="primary-button" onClick={save}><span aria-hidden="true">✓</span> Guardar avatar</button>
            <div className="export-controls">
              <label><span>Formato</span><select value={format} onChange={(event) => setFormat(event.target.value as 'png' | 'svg')}><option value="png">PNG</option><option value="svg">SVG</option></select></label>
              {format === 'png' && <label><span>Tamaño</span><select value={size} onChange={(event) => setSize(Number(event.target.value) as 512 | 1024)}><option value="512">512 px</option><option value="1024">1024 px</option></select></label>}
              <button className="download-button" onClick={doExport} aria-label="Descargar avatar">↓</button>
            </div>
          </div>
          <p className="status-message" role="status" aria-live="polite">{message}</p>
        </section>
      </div>
    </main>
  );
}
