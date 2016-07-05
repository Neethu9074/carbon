import THREE from 'three';

import fragmentShader from 'in-map/src/SingleMeshFactory/lineFragmentShader.glsl';
import vertexShader from 'in-map/src/SingleMeshFactory/lineVertexShader.glsl';

import ASingleMeshFactory from './ASingleMeshFactory';


export default class SingleMeshlineSMF extends ASingleMeshFactory {

  constructor({scene, renderOrder = 2}) {
    super({scene, renderOrder});
  }

  getMesh() {
    return new THREE.LineSegments(
      this.geometry,
      this.material
    );
  }

  getMaterial() {
    const material = new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });

    if (navigator.platform.indexOf('Win') < 0) {
      material.linewidth = 2;
    }

    return material;
  }

  updateGeometry() {
    super.updateGeometry();

    const geometry = this.geometry;
    const vertices = this.vertices;
    const progresses = new Float32Array(vertices.length / 3);
    const length = new Float32Array(vertices.length / 3);

    for (let i = 0; i < progresses.length; i++) {
      progresses[i] = i % 2 === 0 ? 0 : 1;
    }

    for (let i = 0; i < progresses.length; i += 2) {
      const indexOfAInVertexArray = i * 3;
      const indexOfBInVertexArray = (i + 1) * 3;
      const distanceX = vertices[indexOfAInVertexArray] - vertices[indexOfBInVertexArray];
      const distanceY = vertices[indexOfAInVertexArray + 1] - vertices[indexOfBInVertexArray + 1];
      const distanceZ = vertices[indexOfAInVertexArray + 2] - vertices[indexOfBInVertexArray + 2];
      const distance = Math.sqrt(
                         distanceX * distanceX +
                         distanceY * distanceY +
                         distanceZ * distanceZ
                       );

      length[i] = distance;
      length[i + 1] = distance;
    }

    geometry.addAttribute('progress', new THREE.BufferAttribute(progresses, 1));
    geometry.addAttribute('length', new THREE.BufferAttribute(length, 1));

    geometry.attributes.progress.needsUpdate = true;
    geometry.attributes.length.needsUpdate = true;
  }
}
