import THREE from 'three';

import fragmentShader from 'in-components/graphView/components/nodeFragmentShader.glsl';
import vertexShader from 'in-components/graphView/components/nodeVertexShader.glsl';
import BaseGeometry from 'in-components/graphView/components/BaseGeometry';


export default class NodesGeometry extends BaseGeometry {

  constructor() {
    super();

    this.setColors([]);
  }

  getShader() {
    return {
      vertexShader,
      fragmentShader
    };
  }

  getMesh(geometry, material) {
    return new THREE.Points(geometry, material);
  }

  updateGeometry(graph) {

    const vertices = [];
    const colors = [];

    let i = 0;
    let i2 = 0;
    graph.eachNode(node => {
      const pos = node.springyNode.position;
      const color = node.color;

      vertices[i++] = pos.x;
      vertices[i++] = pos.y;
      vertices[i++] = pos.z;

      colors[i2++] = color.r;
      colors[i2++] = color.g;
      colors[i2++] = color.b;
    });

    this.setVertices(vertices);
    this.setColors(colors);
  }
}
