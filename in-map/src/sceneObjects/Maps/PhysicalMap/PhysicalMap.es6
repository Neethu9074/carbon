import THREE from 'three';

import MouseCameraController from '../../../controls/MouseCameraController';
import groundTexturePath from './ground.png';
import BaseMap from '../BaseMap';


export default class PhysicalMap extends BaseMap {

  constructor({parent}) {
    super({parent, id: 'PhysicalMap'});
  }

  getController(canvas) {
    return new MouseCameraController({
      scene: this.scene,
      map: this,
      canvas
    });
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
