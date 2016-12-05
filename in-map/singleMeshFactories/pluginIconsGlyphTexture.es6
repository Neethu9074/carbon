import {Texture, LinearFilter} from 'in-map/3DLibProvider';
import{updateCanvasDimensions} from 'in-charts/canvas';
import {getAllIcons} from 'in-sdk/iconRegistry';


export const config = {
  numElementsPerColumn: Math.ceil(Math.sqrt(getAllIcons().length)),
  iconWidth: 128,
  LUT: {}
};

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const texDimension = config.numElementsPerColumn * config.iconWidth;
updateCanvasDimensions(canvas, context, texDimension, texDimension, 1);

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

  getAllIcons().forEach(icon => {
    const x = column * iconWidth;
    const y = row * iconWidth;
    const image = document.createElement('img');

    image.src = icon.image;
    image.onload = () => {
      // if the image is 100 x 100 in width don't draw it directly for 0 - 100
      // use 2 - 98 instead to get a clear border to avoid nastly artifacts caused by rounding issues
      context.drawImage(image, x + 2, y + 2, iconWidth - 4, iconWidth - 4);
    };

    // update Look Up Table
    config.LUT[icon.id] = {x, y};

    column++;
    if (column >= config.numElementsPerColumn) {
      column = 0;
      row++;
    }
  });
}
