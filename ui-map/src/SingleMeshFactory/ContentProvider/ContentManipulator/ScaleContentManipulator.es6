'use strict';

import ContentManipulator from './ContentManipulator';


export default class ScaleContentManipulator extends ContentManipulator {

  constructor({contentProvider, x=1, y=1, z=1}) {
    super({contentProvider});

    this.scale = {x, y, z};
  }

  getVertices() {
    const scale = this.scale;
    const vertices = this.contentProvider.getVertices();
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] *= scale.x;
      vertices[i + 1] *= scale.y;
      vertices[i + 2] *= scale.z;
    }

    return vertices;
  }

  getColors() {
    return this.contentProvider.getColors();
  }
}
