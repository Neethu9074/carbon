import fragmentShader from 'in-components/graphView/components/edgeFragmentShader.glsl';
import vertexShader from 'in-components/graphView/components/edgeVertexShader.glsl';

import BaseGeometry from 'in-components/graphView/components/BaseGeometry';
import { LineSegments } from 'in-map/3DLibProvider';

export default class NodesGeometry extends BaseGeometry {
  constructor() {
    super();
  }

  getShader() {
    return {
      vertexShader,
      fragmentShader
    };
  }

  getMesh(geometry, material) {
    return new LineSegments(geometry, material);
  }

  updateGeometry(graph) {
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
