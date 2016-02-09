import THREE from 'three';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class SingleMeshFactory extends ASingleMeshFactory {

  constructor({scene, renderOrder = 2}) {
    super({scene, renderOrder});
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
