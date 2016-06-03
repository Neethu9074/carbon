import THREE from 'three';

import BaseGeometry from 'in-components/graphView/components/BaseGeometry';


export default class NodesGeometry extends BaseGeometry {

  constructor() {
    super();
  }

  getMaterial() {
    return new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0.1
    });
  }

  getMesh(geometry, material) {
    return new THREE.LineSegments(geometry, material);
  }

  update(graph) {
    const vertices = [];

    let i = 0;
    graph.eachEdge(edge => {
      const from = edge.from.springyNode.position;
      const to = edge.to.springyNode.position;

      vertices[i++] = from.x;
      vertices[i++] = from.y;
      vertices[i++] = from.z;
      vertices[i++] = to.x;
      vertices[i++] = to.y;
      vertices[i++] = to.z;
    });

    this.setVertices(vertices);
  }
}
