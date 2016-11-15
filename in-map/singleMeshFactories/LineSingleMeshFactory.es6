import fragmentShader from 'in-map/singleMeshFactories/basicFragmentShader.glsl';
import vertexShader from 'in-map/singleMeshFactories/basicVertexShader.glsl';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';
import {LineSegments, RawShaderMaterial} from 'in-map/3DLibProvider';


export default class LineSingleMeshFactory extends ASingleMeshFactory {

  constructor(options) {
    super(options);
  }

  getMesh(geometry, material) {
    return new LineSegments(geometry, material);
  }

  getMaterial() {
    const material = new RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: false,
      uniforms: {
        opacity: {
          type: 'f',
          value: 0.2
        }
      }
    });

    if (navigator.platform.indexOf('Win') < 0) {
      material.linewidth = 2;
    }

    return material;
  }
}
