'use strict';

import THREE from 'three';
import ContentManipulator from './ContentManipulator';


export default class PositionContentManipulator extends ContentManipulator {

  constructor({contentProvider, x, y, z}) {
    super({contentProvider});

    this.position = new THREE.Vector3(x, y, z);
  }

  getVertices() {
    const position = this.position;
    const vertices = this.contentProvider.getVertices();
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] += position.x;
      vertices[i + 1] += position.y;
      vertices[i + 2] += position.z;
    }

    return vertices;
  }

  getColors() {
    return this.contentProvider.getColors();
  }
}
