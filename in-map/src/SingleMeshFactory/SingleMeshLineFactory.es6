import THREE from 'three';

import ASingleMeshFactory from './ASingleMeshFactory';

export default class SingleMeshLineFactory extends ASingleMeshFactory {

  constructor({scene, renderOrder = 2}) {
    super({scene, renderOrder});
  }

  getMesh() {
    return new THREE.LineSegments(
      this.geometry,
      this.material
    );
  }

  getMaterial() {
    const material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors
    });

    if (navigator.platform.indexOf('Win') < 0) {
      material.linewidth = 2;
    }

    return material;
  }
}
