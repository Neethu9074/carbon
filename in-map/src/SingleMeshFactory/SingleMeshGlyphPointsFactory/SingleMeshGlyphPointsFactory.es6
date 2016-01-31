/* global require:false */
import THREE from 'three';

import {glyphTexture, config} from './pluginIconsGlyphTexture';
import ASingleMeshFactory from '../ASingleMeshFactory';
import fragmentShader from './pointFragmentShader.glsl';
import vertexShader from './pointVertexShader.glsl';
import {aspectRatio} from '../../mapStores';


export default class SingleMeshGlyphPointsFactory extends ASingleMeshFactory {
  constructor({id, scene, renderOrder = 10, snapshot}) {
    super({scene, renderOrder, params: {id, snapshot}});

    this.aspectRationSubscription = aspectRatio.subscribe(aspect =>
      this.material.uniforms.aspect.value = 1.25 / aspect);
  }

  getMesh() {
    return new THREE.Points(this.geometry, this.material);
  }

  getMaterial() {
    return new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false,
      uniforms: {
        texture: { type: 't', value: glyphTexture },
        numColumns: { type: 'f', value: config.numElementsPerColumn },
        aspect: { type: 'f', value: 1 }
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

    geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(this.colors), 3));
    geometry.attributes.color.needsUpdate = true;

    const uvCoords = [];
    const textureWidth = config.numElementsPerColumn * config.iconWidth;
    this.fragments.forEach((fragment) => {
      const xy = config.LUT[fragment.additionalParams.type];
      if (!xy) {
        console.log('there is not glyph defined for', fragment.additionalParams.type);
        uvCoords.push(0);
        uvCoords.push(0);
      } else {
        uvCoords.push(xy.x / textureWidth);
        uvCoords.push(xy.y / textureWidth);
      }
    });
    geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvCoords), 2));
    geometry.attributes.uv.needsUpdate = true;
  }

  dispose() {
    this.aspectRationSubscription.dispose();

    super.dispose();
  }
}
