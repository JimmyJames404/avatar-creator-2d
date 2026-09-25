import { AvatarCreator } from '../avatar/components/AvatarCreator';
import { AvatarProfilePicture } from '../avatar/components/AvatarProfilePicture';
import { DEFAULT_AVATAR } from '../avatar/avatarEngine';
import { randomizeAvatar } from '../avatar/avatarRandomizer';

const examples = [0.12, 0.38, 0.73].map((seed) => randomizeAvatar(DEFAULT_AVATAR, undefined, () => seed));

export function AvatarDemo() {
  return (
    <div className="app-frame">
      <AvatarCreator />
      <section className="showcase" aria-labelledby="showcase-title">
        <div><span className="eyebrow">COMPONENTE REUTILIZABLE</span><h2 id="showcase-title">Listos para cada perfil</h2><p>El mismo objeto de configuración reconstruye el personaje en perfiles, listados y paneles.</p></div>
        <div className="profile-row">{examples.map((avatar, index) => <div key={index}><AvatarProfilePicture avatar={avatar} shape={index === 1 ? 'square' : 'circle'} size={112}/><span>Avatar {String(index + 1).padStart(2, '0')}</span></div>)}</div>
      </section>
      <footer><span>AVATAR LAB</span><span>Assets originales de demostración · 512 × 512</span></footer>
    </div>
  );
}
