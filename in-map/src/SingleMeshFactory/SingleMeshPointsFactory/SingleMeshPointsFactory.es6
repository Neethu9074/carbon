/*global require:false*/
import THREE from 'three';

import {getIcon} from 'in-sdk/snapshot';

import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';

const context = require.context('./', true, /\/[a-zA-Z0-9]+\.png$/);

export default class SingleMesPointsFactory extends ASingleMeshFactory {

  constructor({scene, type, renderOrder = 10}) {
    super({scene, renderOrder, params: { type } });
  }

  getMesh() {
    return new THREE.Points(this.geometry, this.material);
  }

  getMaterial() {
    const icon = getIcon(this.params.type) || context('./default.png');
    const texture = THREE.ImageUtils.loadTexture(icon);
    texture.minFilter = THREE.LinearFilter;
    texture.flipY = false;

    const uniforms = {
      texture: { type: 't', value: texture }
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
