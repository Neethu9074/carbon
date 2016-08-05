import THREE from 'three';


const LOADING_MANAGER = new THREE.LoadingManager();
const IMAGE_LOADER = new THREE.ImageLoader(LOADING_MANAGER);


export function loadImage(url, callback) {
  const texture = new THREE.Texture();
  texture.image = IMAGE_LOADER.load(url, () => callback(texture));
  return texture;
}
