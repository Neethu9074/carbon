import THREE from 'three';

import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';


export default class BasicSingleMeshFactory extends ASingleMeshFactory {

  constructor(renderOrder) {
    super(renderOrder);
  }

  getMesh(geometry, material) {
    return new THREE.Mesh(geometry, material);
  }

  getMaterial() {
    return new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true
    });
  }

  dispose() {
    super.dispose();
  }
}
