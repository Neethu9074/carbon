/*global require:false*/
import THREE from 'three';

import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';

const context = require.context('./', true, /\/[a-zA-Z0-9]+\.png$/);

export default class SingleMesPointsFactory extends ASingleMeshFactory {

  constructor({scene, type, renderOrder = 2}) {
    super({scene, renderOrder, params: { type } });
  }

  getMesh() {
    return new THREE.Points(this.geometry, this.material);
  }

  getMaterial() {
    const uniforms = {
      texture: { type: 't', value: THREE.ImageUtils.loadTexture(context('./' + this.params.type + '.png')) }
    };

    return new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: uniforms,
      depthTest: false,
      transparent: true
    });
  }
}
