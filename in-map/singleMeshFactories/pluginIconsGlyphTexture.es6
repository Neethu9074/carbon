import {Texture, LinearFilter} from 'in-map/3DLibProvider';
import {getAllIcons} from 'in-sdk/iconRegistry';


export const glyphTexture = new Texture();

export const config = {
  numElementsPerColumn: Math.ceil(Math.sqrt(getAllIcons().length)),
  iconWidth: 128,
  LUT: {}
};

glyphTexture.minFilter = LinearFilter;
glyphTexture.generateMipmaps = false;
glyphTexture.flipY = false;
create(glyphTexture);

function create(texture) {
  const iconWidth = config.iconWidth;
  const canvas = document.createElement('canvas');
  canvas.width = config.numElementsPerColumn * iconWidth;
  canvas.height = config.numElementsPerColumn * iconWidth;
  texture.image = canvas;

  let row = 0;
  let column = 0;
  const context = canvas.getContext('2d');

  getAllIcons().forEach(icon => {
    const x = column * iconWidth;
    const y = row * iconWidth;
    const image = document.createElement('img');

    image.src = icon.image;
    image.onload = () => {
      // if the image is 100 x 100 in width don't draw it directly for 0 - 100
      // use 2 - 98 instead to get a clear border to avoid nastly artifacts caused by rounding issues
      context.drawImage(image, x + 2, y + 2, iconWidth - 4, iconWidth - 4);
      texture.needsUpdate = true;
    };

    // update Look Up Table
    config.LUT[icon.id] = {x, y};

    column++;
    if (column >= config.numElementsPerColumn) {
      column = 0;
      row++;
    }
  });

  texture.needsUpdate = true;
}
