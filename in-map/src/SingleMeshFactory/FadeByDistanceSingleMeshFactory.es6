import THREE from 'three';

import fragmentShader from 'in-map/src/SingleMeshFactory/fadeByDistanceFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/fadeByDistanceVertexShader.glsl';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class FadeByDistanceSingleMeshFactory extends ASingleMeshFactory {

  constructor({renderOrder = 2}) {
    super({renderOrder});
  }

  getMesh() {
    return new THREE.Mesh(this.geometry, this.material);
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
}
