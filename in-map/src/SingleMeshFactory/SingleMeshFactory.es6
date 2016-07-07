import THREE from 'three';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class SingleMeshFactory extends ASingleMeshFactory {

  constructor(props = {renderOrder: 2}) {
    super(props);
  }

  getMesh() {
    return new THREE.Mesh(this.geometry, this.material);
  }

  getMaterial() {
    return new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true
    });
  }
}
