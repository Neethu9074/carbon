/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import { Texture, LinearFilter } from 'in-map/3DLibProvider';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import { getRegistry } from 'in-sdk/iconType';

const allIcons = getRegistry();
export const config = {
  numElementsPerColumn: Math.ceil(Math.sqrt(allIcons.length)),
  iconWidth: 128,
  LUT: {}
};

const canvas = document.createElement('canvas');
canvas.width = canvas.height = config.numElementsPerColumn * config.iconWidth;
const context = canvas.getContext('2d');
context.fillStyle = '#fff';

if (__DEV__ && canvas.width > 4000) {
  const logger = createLogger('in-map/singleMeshFactories/pluginIconsGlyphTexture');
  logger.warn('The atlas map has reached a critical size of', canvas.width, '. We should spit them into 1k maps.');
}

export const glyphTexture = new Texture(canvas);
glyphTexture.minFilter = LinearFilter;
glyphTexture.magFilter = LinearFilter;
glyphTexture.generateMipmaps = false;
glyphTexture.needsUpdate = true;
glyphTexture.flipY = false;

let initialized = false;
export function init() {
  if (initialized) {
    return;
  }
  initialized = true;

  const factor = config.iconWidth / 24;
  const iconWidth = config.iconWidth;
  let column = 0;
  let row = 0;

  allIcons.forEach(icon => {
    let x = column * iconWidth;
    let y = row * iconWidth;

    const p = new Path2D(icon.path);

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
    context.setTransform(factor, 0, 0, factor, x, y);

    context.fill(p);

    // update Look Up Table
    config.LUT[fullyQualifiedPlugins[icon.id]] = { x, y };

    column++;
    if (column >= config.numElementsPerColumn) {
      column = 0;
      row++;
    }
  });
}
