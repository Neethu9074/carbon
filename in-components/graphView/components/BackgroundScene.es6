import THREE from 'three';

import galaxyImagePath from 'in-components/graphView/components/background.jpg';
import {loadImage} from 'in-map/src/services/imageLoader';


export default class BackgroundScene {
  constructor() {
    this.backgroundCamera = new THREE.OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 10);
    this.backgroundScene = new THREE.Scene();

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const plane = this.plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 1, 1, 1, 1),
      material
    );

    plane.rotationAutoUpdate = false;
    plane.matrixAutoUpdate = false;
    plane.frustumCulled = false;
    plane.position.set(0, 0, -1);
    plane.updateMatrix();

    this.backgroundScene.add(plane);

    const texture = loadImage(galaxyImagePath, loadedTexture => {
      loadedTexture.needsUpdate = true;
    });

    texture.minFilter = THREE.LinearFilter;
    material.map = texture;
  }

  render(renderer) {
    renderer.render(this.backgroundScene, this.backgroundCamera);
  }

  dispose() {
    // TODO
  }
}
