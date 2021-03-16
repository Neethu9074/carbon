/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ImageLoader, Texture } from 'in-map/3DLibProvider';

const IMAGE_LOADER = new ImageLoader();

export function loadImage(url, callback) {
  const texture = new Texture();
  texture.image = IMAGE_LOADER.load(url, () => callback(texture));
  return texture;
}
