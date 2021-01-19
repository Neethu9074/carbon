/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import fragmentShader from 'in-map/singleMeshFactories/fadeByDistanceFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/fadeByDistanceVertexShader.glsl';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';
import { RawShaderMaterial, Mesh, DoubleSide } from 'in-map/3DLibProvider';

export default class FadeByDistanceSingleMeshFactory extends ASingleMeshFactory {
  constructor(options) {
    super(options);

    this.minOpacity = options.minOpacity || 0.1;
    this.maxOpacity = options.maxOpacity || 0.6;
  }

  getMesh(geometry, material) {
    return new Mesh(geometry, material);
  }

  getMaterial() {
    return new RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: DoubleSide,
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
