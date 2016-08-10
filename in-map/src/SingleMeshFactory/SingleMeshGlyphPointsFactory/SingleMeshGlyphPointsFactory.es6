/* global require:false */
import THREE from 'three';

import {glyphTexture, config} from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pluginIconsGlyphTexture';
import fragmentShader from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pointFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/SingleMeshGlyphPointsFactory/pointVertexShader.glsl';
import ASingleMeshFactory from 'in-map/src/SingleMeshFactory/ASingleMeshFactory';
import {updateAttribute} from 'in-map/src/services/geometryAttributes';


export default class SingleMeshGlyphPointsFactory extends ASingleMeshFactory {
  constructor(props = {renderOrder: 10}) {
    super(props);
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

    updateAttribute(geometry, 'pointSize', pointSizes, 1);
    updateAttribute(geometry, 'color', this.colors);

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

    updateAttribute(geometry, 'uv', uvCoords, 2);
  }

  dispose() {
    super.dispose();
  }
}
