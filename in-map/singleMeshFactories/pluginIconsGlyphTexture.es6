import { Texture, LinearFilter } from 'in-map/3DLibProvider';
import { getAllSvgIconPaths } from 'in-sdk/iconRegistry';

const allIcons = getAllSvgIconPaths();
export const config = {
  numElementsPerColumn: Math.ceil(Math.sqrt(allIcons.length)),
  iconWidth: 128,
  LUT: {}
};

const canvas = document.createElement('canvas');
canvas.width = (canvas.height = config.numElementsPerColumn * config.iconWidth);

const context = canvas.getContext('2d');
context.fillStyle = '#fff';

export const glyphTexture = new Texture(canvas);
glyphTexture.minFilter = LinearFilter;
glyphTexture.magFilter = LinearFilter;
glyphTexture.generateMipmaps = false;
glyphTexture.needsUpdate = true;
glyphTexture.flipY = false;

export function init() {
  const iconWidth = config.iconWidth;
  let column = 0;
  let row = 0;

  allIcons.forEach(icon => {
    let x = column * iconWidth;
    let y = row * iconWidth;

    const p = new Path2D(icon.path);

    // reduce the size of each icon and add an offset to get at least 2 pixels of margin.
    // this avoids nasty artifacts caused by shaders floating precision.
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
    context.setTransform(0.95, 0, 0, 0.95, x + 2, y + 2);

    context.fill(p);

    // update Look Up Table
    config.LUT[icon.id] = { x, y };

    column++;
    if (column >= config.numElementsPerColumn) {
      column = 0;
      row++;
    }
  });
}
