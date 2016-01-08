import THREE from 'three';

import groundTexturePath from './ground.png';
import GroundPlane from './GroundPlane';


export default class GroupPlaneWithGrid extends GroundPlane {

  constructor({parent, size}) {
    super({parent, size});

    this.ground.material.map = this.getGroundTexture();
  }

  getGroundTexture() {
    const quadsPerWorldUnit = 3;
    const repating = quadsPerWorldUnit * this.size;
    const texture = new THREE.TextureLoader().load(
      groundTexturePath,
      () => { this.scene.renderScene(); });

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repating, repating);

    // set the ground anisotropy to the max because it's a huge ground always
    // seen and it needs to be as sharp as possible
    texture.anisotropy = this.scene.webGLRenderer.getMaxAnisotropy();

    this.groundtexture = texture;
    return texture;
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
