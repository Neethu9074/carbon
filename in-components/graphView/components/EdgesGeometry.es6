import THREE from 'three';


const emptyVertices = [0, 0, 0, 0, 0, 0];

export default class NodesGeometry {

  constructor() {
    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;

    const material = this.material = new THREE.LineBasicMaterial({
      transparent: true,
      color: 0xBBBBBB,
      opacity: 0.1
    });

    const mesh = this.mesh = new THREE.LineSegments(geometry, material);
    mesh.frustumCulled = false;

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(emptyVertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  update(graph) {
    let vertices = [];

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

    if (vertices.length === 0) {
      vertices = emptyVertices;
    }

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  renderableGeometry() {
    return this.mesh;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();

    // TODO: dispose rest
  }
}
