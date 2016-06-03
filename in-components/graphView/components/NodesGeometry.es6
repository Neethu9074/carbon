import THREE from 'three';

import fragmentShader from 'in-components/graphView/components/nodeFragmentShader.glsl';
import vertexShader from 'in-components/graphView/components/nodeVertexShader.glsl';
import BaseGeometry from 'in-components/graphView/components/BaseGeometry';


export default class NodesGeometry extends BaseGeometry {

  constructor() {
    super();
  }

  getMaterial() {
    return new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
      depthTest: false
    });
  }

  getMesh(geometry, material) {
    return new THREE.Points(geometry, material);
  }

  update(graph) {
    const vertices = [];

    let i = 0;
    graph.eachNode(node => {
      const pos = node.springyNode.position;

      vertices[i++] = pos.x;
      vertices[i++] = pos.y;
      vertices[i++] = pos.z;
    });

    this.setVertices(vertices);
  }
}
