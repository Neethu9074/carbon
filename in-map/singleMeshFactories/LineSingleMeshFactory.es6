import {VertexColors, LineSegments, LineBasicMaterial} from 'three';

import ASingleMeshFactory from 'in-map/singleMeshFactories/ASingleMeshFactory';


export default class LineSingleMeshFactory extends ASingleMeshFactory {

  constructor(options) {
    super(options);
  }

  getMesh(geometry, material) {
    return new LineSegments(geometry, material);
  }

  getMaterial() {
    const material = new LineBasicMaterial({
      vertexColors: VertexColors
    });

    if (navigator.platform.indexOf('Win') < 0) {
      material.linewidth = 2;
    }

    return material;
  }
}
