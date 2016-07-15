import THREE from 'three';

import fragmentShader from 'in-map/src/SingleMeshFactory/fadeByDistanceFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/fadeByDistanceVertexShader.glsl';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class FadeByDistanceSingleMeshFactory extends ASingleMeshFactory {

  constructor(props = {renderOrder: 2, params: {minOpacity: 0.1, maxOpacity: 0.6}}) {
    super(props);
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
      depthWrite: true,
      uniforms: {
        minOpacity: {
          type: 'f',
          value: this.params && this.params.minOpacity ? this.params.minOpacity : 0.1
        },
        maxOpacity: {
          type: 'f',
          value: this.params && this.params.maxOpacity ? this.params.maxOpacity : 0.6
        }
      }
    });
  }
}
