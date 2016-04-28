import THREE from 'three';

import {hexToRGBNormalized} from 'in-services/formatters/color';
import theme from 'in-services/theme';

import BaseGroundPlane from '../common/GroundPlane';
import groundTexturePath from './ground.png';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});

    this.getGroundTexture();
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 3;
    const repating = quadsPerWorldUnit * this.size;
    const texture = new THREE.TextureLoader().load(
      groundTexturePath,
      loadedTexture => {
        this.scene.renderScene();

        this.ground.material.dispose();
        this.ground.material = new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          map: loadedTexture
        });

        const color = hexToRGBNormalized(theme.map.colors.groundDots);
        this.ground.material.color.r = color.r;
        this.ground.material.color.g = color.g;
        this.ground.material.color.b = color.b;
      });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repating, repating);

    // set the ground anisotropy to the max because it's a huge ground always
    // seen and it needs to be as sharp as possible
    texture.anisotropy = this.scene.webGLRenderer.getMaxAnisotropy();

    this.groundtexture = texture;
  }

  onZoom(zoomLevel) {
    const size = this.size;
    if (zoomLevel < 120) {
      this.groundtexture.repeat.set(3 * size, 3 * size);
    } else {
      this.groundtexture.repeat.set(size, size);
    }
  }

  dispose() {
    super.dispose();
  }
}
