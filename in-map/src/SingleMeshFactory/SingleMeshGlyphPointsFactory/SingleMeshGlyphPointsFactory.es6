/* global require:false */
import THREE from 'three';

import {glyphTexture, config} from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pluginIconsGlyphTexture';
import fragmentShader from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pointFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pointVertexShader.glsl';
import ASingleMeshFactory from 'in-map/src/SingleMeshFactory/ASingleMeshFactory';


export default class SingleMeshGlyphPointsFactory extends ASingleMeshFactory {
  constructor({id, scene, renderOrder = 10, snapshot}) {
    super({scene, renderOrder, params: {id, snapshot}});
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
        numColumns: { type: 'f', value: config.numElementsPerColumn }
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
    this.fragments.forEach(fragment => {
      const xy = config.LUT[fragment.additionalParams.type];
      if (!xy) {
        // use right bottom UV coords to show nothing but emptiness
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
    super.dispose();
  }
}
