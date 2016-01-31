import THREE from 'three';

import {getAllIcons} from 'in-sdk/iconRegistry';


export const glyphTexture = new THREE.Texture();

export const config = {
  numElementsPerColumn: Math.ceil(Math.sqrt(getAllIcons().length)),
  iconWidth: 128,
  LUT: {}
};


glyphTexture.minFilter = THREE.LinearFilter;
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
      context.drawImage(image, x, y);
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
