import THREE from 'three';

import {requestRendering} from 'in-map/src/stores/renderingStore';
import {hexToRGBNormalized} from 'in-services/formatters/color';
import {addSceneObject} from 'in-map/src/stores/sceneStore';
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
        const ground = this.ground;
        ground.material.dispose();
        ground.material = new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,
          map: loadedTexture
        });

        const color = hexToRGBNormalized(theme.map.colors.groundDots);
        ground.material.color.r = color.r;
        ground.material.color.g = color.g;
        ground.material.color.b = color.b;

        addSceneObject(ground);
        requestRendering();
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
}
