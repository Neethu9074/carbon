import THREE from 'three';

import fragmentShader from 'in-map/singleMeshFactories/fadeByDistanceFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/fadeByDistanceVertexShader.glsl';
import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';


export default class FadeByDistanceSingleMeshFactory extends ASingleMeshFactory {

  constructor(minOpacity = 0.1, maxOpacity = 0.6) {
    super();

    this.minOpacity = minOpacity;
    this.maxOpacity = maxOpacity;
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
      depthWrite: true,
      uniforms: {
        minOpacity: {
          type: 'f',
          value: this.minOpacity
        },
        maxOpacity: {
          type: 'f',
          value: this.maxOpacity
        }
      }
    });
  }

  lockOpacity(value) {
    this.material.uniforms.minOpacity.value = value;
    this.material.uniforms.maxOpacity.value = value;
  }

  unlockOpacity() {
    this.material.uniforms.minOpacity.value = this.minOpacity;
    this.material.uniforms.maxOpacity.value = this.maxOpacity;
  }

  dispose() {
    super.dispose();

    this.minOpacity = null;
    this.maxOpacity = null;
  }
}
