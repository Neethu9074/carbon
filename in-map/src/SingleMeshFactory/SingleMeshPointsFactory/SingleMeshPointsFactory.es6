/* global require:false */
import THREE from 'three';

import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {getIcon} from 'in-sdk/snapshot';

import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';


const context = require.context('./', true, /\/[a-zA-Z0-9]+\.png$/);

export default class SingleMeshPointsFactory extends ASingleMeshFactory {

  constructor({scene, type, renderOrder = 10, size}) {
    super({scene, renderOrder, params: { type, size } });

    const mesh = this.mesh;
    scene.removeSceneObject(mesh);
    this.zoomSubscription = zoomLevel.subscribe(l => {
      if (l !== level.nearest) {
        scene.removeSceneObject(mesh);
      } else {
        scene.addSceneObject(mesh);
      }
    });
  }

  getMesh() {
    return new THREE.Points(this.geometry, this.material);
  }

  getMaterial() {
    const icon = getIcon(this.params.type) || context('./default.png');
    const image = document.createElement('img');
    image.src = icon;
    image.height = 128 * this.params.size;
    const texture = new THREE.Texture(image);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;
    image.addEventListener('load', () => {
      texture.needsUpdate = true;
    });

    return new THREE.RawShaderMaterial({
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false,
      uniforms: {
        texture: { type: 't', value: texture },
        pointSize: { type: 'f', value: this.params.size }
      }
    });
  }
}
