import {ImageLoader, Texture} from 'three';


const IMAGE_LOADER = new ImageLoader();


export function loadImage(url, callback) {
  const texture = new Texture();
  texture.image = IMAGE_LOADER.load(url, () => callback(texture));
  return texture;
}
