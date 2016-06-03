import THREE from 'three';


export default class NodesGeometry {

  constructor() {
    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;

    const material = this.material = new THREE.LineBasicMaterial({
      color: 0xBBBBBB,
      transparent: true,
      opacity: 0.1
    });

    const mesh = this.mesh = new THREE.LineSegments(geometry, material);
    mesh.frustumCulled = false;
  }

  update(graph) {
    const vertices = [];

    graph.eachEdge(edge => {
      const from = edge.from.springyNode.position;
      const to = edge.to.springyNode.position;

      vertices.push(from.x, from.y, from.z, to.x, to.y, to.z);
    });

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  renderableGeometry() {
    return this.mesh;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
