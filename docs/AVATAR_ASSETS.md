# Guía de assets del Avatar Creator

Esta guía permite producir nuevas piezas sin tocar el renderer ni los componentes React. El contenido vive en `public/avatar/` y se registra en `src/avatar/avatar-manifest.json`.

## Canvas y coordenadas

Todos los assets de composición usan un `viewBox="0 0 512 512"`. El origen `(0, 0)` está arriba a la izquierda. No recortes el SVG al contenido: conserva siempre el canvas completo, incluso si la pieza ocupa una zona pequeña. El centro del rostro está aproximadamente en `(256, 210)`, los hombros comienzan cerca de `y=340` y el borde inferior del torso coincide con `y=512`.

PNG y WebP también son válidos. Para esos formatos usa exactamente 512 × 512 píxeles, fondo transparente y el mismo sistema de coordenadas. Para arte de alta densidad puede usarse 1024 × 1024 manteniendo la proporción y declarar esa convención para todo el pack.

## Orden de capas

El orden se define una sola vez en `layerOrder` dentro del manifest:

1. `background`
2. `body`
3. `ears`
4. `hairBack`
5. `face`
6. `eyesBase`
7. `eyesColor`
8. `eyebrows`
9. `mouth`
10. `outfit`
11. `neckAccessory`
12. `sash`
13. `sashHonors`
14. `hairFront`
15. `glasses`
16. `headwear`
17. `accessory`
18. `foregroundEffect`

Una pieza puede producir varias capas. Esto se usa en cabello y ojos, y también puede utilizarse para sombreros, ropa o accesorios.

## Convención de nombres

Usa IDs únicos en minúsculas y separados por guiones: `hair-braids`, `outfit-field-02`. Los archivos siguen `public/avatar/<categoria>/<nombre>-<capa>.svg`. No cambies un ID después de publicarlo: el ID se guarda en `AvatarConfig`.

## Agregar un cabello

1. Crea `public/avatar/hair/braids-back.svg` y `braids-front.svg`, ambos en canvas 512 × 512.
2. Para recolor automático, dibuja la silueta que recibe color en negro sólido. El renderer la utiliza como máscara.
3. Crea una miniatura optimizada de 128 × 128 en `public/avatar/thumbs/hair-braids.svg`.
4. Agrega el item a la categoría `hair`:

```json
{
  "id": "hair-braids",
  "name": "Trenzas",
  "thumbnail": "/avatar/thumbs/hair-braids.svg",
  "colors": ["ink", "espresso", "gold"],
  "tags": ["hair-low"],
  "layers": [
    { "slot": "hairBack", "src": "/avatar/hair/braids-back.svg", "tint": "hairColor" },
    { "slot": "hairFront", "src": "/avatar/hair/braids-front.svg", "tint": "hairColor" }
  ]
}
```

5. Ejecuta `npm run avatar:validate`.

## Agregar ropa

Crea el asset completo en `public/avatar/outfits/`, manteniendo cuello y hombros alineados con las bases. Si toda la prenda puede tomar un solo color, usa una silueta negra y `"tint": "outfitColor"`. Para una prenda multicolor, usa el SVG con sus colores finales y omite `tint`. Registra el item en `outfit`, agrega un thumbnail de 128 × 128 y valida el pack.

## Agregar una categoría

Añade una entrada en `categories` con `id`, `label`, `icon`, `selectionKey` e `items`. Añade la clave al tipo `AvatarSelectionKey` y a `AvatarConfig`; define su valor por defecto en `DEFAULT_AVATAR`. Si necesita una posición visual nueva, añade un `LayerSlot` y colócalo en `layerOrder`. La UI crea la pestaña y el selector automáticamente.

## Miniaturas

Las miniaturas viven en `public/avatar/thumbs/`, usan 128 × 128 y deben representar la silueta de la opción con buen contraste. Pueden ser SVG, PNG o WebP. La cuadrícula carga `thumbnail` de forma diferida; no apuntes al asset final cuando dispongas de una miniatura optimizada.

## Colores

Las paletas están en `manifest.palettes`. Un layer con `tint` se interpreta como máscara y se pinta con el color elegido en `AvatarConfig`. Los SVG tintables deben tener opacidad donde se necesita color y transparencia en el resto. Para ilustraciones raster con sombreado complejo, crea variantes como items o amplía el manifest con un mapa de variantes por color; la configuración seguirá guardando sólo IDs.

## Compatibilidad y bloqueos

- `incompatibleWith`: lista de IDs concretos que no pueden combinarse.
- `tags`: capacidades o formas que aporta el item.
- `requiresTags`: exige que otra pieza seleccionada tenga esas etiquetas.
- `incompatibleTags`: impide combinar con cualquier pieza que tenga esas etiquetas.
- `unlocked: false`: muestra el candado y excluye la pieza del randomizador, salvo que su ID llegue en `unlockedItemIds`.

Usa etiquetas para reglas que afecten a familias de piezas. Por ejemplo, una gorra puede ser incompatible con `hair-high`.

## Banda y futuras especialidades

La banda es una capa separada. `AvatarConfig.honors` guarda IDs y `AvatarRenderer` ya reserva cuatro ranuras visuales. En producción, agrega un registro de insignias autorizadas y genera las capas de `sashHonors` desde esos IDs. No incrustes las insignias en la imagen base de la banda.

## Sustituir placeholders por arte profesional

Conserva IDs, canvas, coordenadas, nombres de slots y rutas, o actualiza sólo las rutas del manifest. Sustituye cada archivo manteniendo transparencia y alineación. Prueba cabellos sobre ambas formas de rostro, ropa con las dos pañoletas y sombreros con los tags de volumen. No copies emblemas o insignias sin autorización.

Ejecuta `npm run avatar:validate`, `npm test`, `npm run typecheck` y `npm run build` antes de entregar un pack nuevo.
