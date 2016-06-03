import THREE from 'three';

import fragmentShader from 'in-components/graphView/components/nodeFragmentShader.glsl';
import vertexShader from 'in-components/graphView/components/nodeVertexShader.glsl';


export default class NodesGeometry {

  constructor() {
    const geometry = this.geometry = new THREE.BufferGeometry();
    geometry.dynamic = true;

    const material = this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      depthTest: false
    });

    const mesh = this.mesh = new THREE.Mesh(geometry, material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;

    this.update();
  }

  update() {
    const vertices = [
      0, 0, -4,
      0, 0, 4
    ];

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
