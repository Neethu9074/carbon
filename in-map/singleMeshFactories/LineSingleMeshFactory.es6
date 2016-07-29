import THREE from 'three';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';


export default class LineSingleMeshFactory extends ASingleMeshFactory {

  constructor() {
    super();
  }

  getMesh(geometry, material) {
    return new THREE.LineSegments(geometry, material);
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
