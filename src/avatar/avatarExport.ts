import { resolveLayers } from './avatarEngine';
import { avatarManifest } from './avatarManifest';
import type { AvatarConfig } from './types';
import { assetUrl } from './assetUrl';

async function svgDataUri(src: string): Promise<string> {
  const response = await fetch(assetUrl(src));
  if (!response.ok) throw new Error(`No se pudo cargar ${src}`);
  const svg = await response.text();
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export async function composeAvatarSvg(avatar: AvatarConfig): Promise<string> {
  const { width, height } = avatarManifest.canvas;
  const layers = await Promise.all(resolveLayers(avatar).map(async (layer) => {
    const href = await svgDataUri(layer.src);
    if (!layer.color) return `<image href="${href}" width="${width}" height="${height}"/>`;
    const maskId = `m-${layer.itemId}-${layer.slot}`.replace(/[^a-z0-9-]/gi, '');
    return `<defs><mask id="${maskId}"><image href="${href}" width="${width}" height="${height}"/></mask></defs><rect width="${width}" height="${height}" fill="${layer.color}" mask="url(#${maskId})"/>`;
  }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${layers.join('')}</svg>`;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportAvatar(avatar: AvatarConfig, format: 'png' | 'svg', size: 512 | 1024) {
  const svg = await composeAvatarSvg(avatar);
  if (format === 'svg') { download(new Blob([svg], { type: 'image/svg+xml' }), 'mi-avatar.svg'); return; }
  const image = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = reject; image.src = url; });
  const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
  canvas.getContext('2d')!.drawImage(image, 0, 0, size, size); URL.revokeObjectURL(url);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('No se pudo crear el PNG')), 'image/png'));
  download(blob, `mi-avatar-${size}.png`);
}
