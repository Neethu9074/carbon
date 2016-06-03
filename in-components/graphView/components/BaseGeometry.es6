import THREE from 'three';


export default class BaseGeometry {

  constructor() {
    this.emptyVertices = [Number.MAX_VALUE, 0, 0, Number.MAX_VALUE, 0, 0];

    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;

    const material = this.material = this.getMaterial();

    const mesh = this.mesh = this.getMesh(geometry, material);
    mesh.frustumCulled = false;

    this.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.emptyVertices), 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  setVertices(vertices) {
    if (vertices.length === 0) {
      vertices = this.emptyVertices;
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
