import THREE from 'three';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class SingleMeshlineSMF extends ASingleMeshFactory {

  constructor(props = {renderOrder: 2}) {
    super(props);
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
