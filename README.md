# Avatar Creator 2D por capas

Creador de avatares juvenil, responsive y reutilizable construido con React y TypeScript. El personaje se compone desde assets SVG externos definidos por un manifest, sin acoplar el renderer al editor.

## Funciones

- Composición por capas y cabello multicapa.
- Paletas para piel, cabello, ojos y ropa.
- Selector por flechas y cuadrícula adaptable.
- Randomización completa o por categoría.
- Reglas de compatibilidad e items bloqueados.
- Persistencia desacoplada con implementación `localStorage`.
- Exportación PNG 512/1024 y SVG.
- Foto de perfil circular o cuadrada.
- Pack original de demostración y validador de assets.

## Desarrollo

```bash
npm install
npm run dev
```

La demostración está disponible en `/avatar-demo/`.

## Verificación

```bash
npm run avatar:validate
npm run lint
npm run typecheck
npm test
npm run build
```

Consulta [`docs/AVATAR_ASSETS.md`](docs/AVATAR_ASSETS.md) para crear cabello, ropa, thumbnails y nuevas categorías compatibles.
