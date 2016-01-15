/* global require:false */
import THREE from 'three';

import {getIcon} from 'in-sdk/snapshot';

import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';
import {aspectRatio} from '../../mapStores';

import defaultIcon from './default.png';

export default class SingleMeshPointsFactory extends ASingleMeshFactory {
  constructor({id, scene, renderOrder = 10, snapshot}) {
    super({scene, renderOrder, params: {id, snapshot}});

    this.aspectRationSubscription = aspectRatio.subscribe(aspect =>
      this.material.uniforms.aspect.value = 1.25 / aspect);
  }

  getMesh() {
    return new THREE.Points(this.geometry, this.material);
  }

  getMaterial() {
    const icon = getIcon(this.params.snapshot) || defaultIcon;

    const image = document.createElement('img');
    const texture = new THREE.Texture();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const cont = canvas.getContext('2d');
      cont.drawImage(image, 0, 0);

      texture.image = canvas;
      texture.needsUpdate = true;
    };
    image.src = icon;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;

    return new THREE.RawShaderMaterial({
      vertexColors: THREE.VertexColors,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false,
      uniforms: {
        aspect: { type: 'f', value: 1 },
        texture: { type: 't', value: texture }
      }
    });
  }

  updateGeometry() {
    super.updateGeometry();

    const geometry = this.geometry;

    const pointSizes = new Float32Array(this.fragments.length);
    this.fragments.forEach((fragment, index) => {
      pointSizes[index] = fragment.additionalParams.iconSize;
    });

    geometry.addAttribute('pointSize', new THREE.BufferAttribute(pointSizes, 1));
    geometry.attributes.pointSize.needsUpdate = true;
  }

  dispose() {
    this.aspectRationSubscription.dispose();

    super.dispose();
  }
}
