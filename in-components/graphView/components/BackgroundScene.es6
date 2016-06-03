import THREE from 'three';

import galaxyImagePath from 'in-components/graphView/components/background.jpg';


export default class BackgroundScene {
  constructor() {
    this.backgroundCamera = new THREE.OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 10);
    this.backgroundScene = new THREE.Scene();

    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide
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

    const manager = new THREE.LoadingManager();
    const texture = new THREE.Texture();
    new THREE.ImageLoader(manager).load( galaxyImagePath, image => {
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      texture.image = image;
    });
      material.map = texture;
  }

  render(renderer) {
    renderer.render(this.backgroundScene, this.backgroundCamera);
  }
}
