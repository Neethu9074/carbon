/*global require:false*/
import THREE from 'three';

import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {getIcon} from 'in-sdk/snapshot';

import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';


const context = require.context('./', true, /\/[a-zA-Z0-9]+\.png$/);

export default class SingleMesPointsFactory extends ASingleMeshFactory {

  constructor({scene, type, renderOrder = 10}) {
    super({scene, renderOrder, params: { type } });

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
    const material = new THREE.RawShaderMaterial({
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false
    });

    const icon = getIcon(this.params.type) || context('./default.png');
    const texture = THREE.ImageUtils.loadTexture(icon, THREE.UVMapping, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.image.height = 64;
      tex.image.width = 64;
      tex.flipY = false;
    });

    material.uniforms = {
      texture: { type: 't', value: texture }
    };

    return material;
  }
}
