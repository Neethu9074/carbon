'use strict';

import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class LineFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
  }

  rebuild() {
    this.scene.removeSceneObject(this.globalMesh);
    this.globalGeometry.dispose();

    const frags = this.getLegalFragments();
    const numLines = frags.length;
    const vertices = new Float32Array(numLines * 2 * 3);

    for (let i = 0; i < numLines; i++) {
      const fragment = frags[i];
      const pos = fragment.pos;
      const dim = fragment.dim;
      const oV = i * 3 * 2;

      vertices[oV + 0] = pos.x;
      vertices[oV + 1] = pos.y + dim.y + 0.1;
      vertices[oV + 2] = pos.z;

      vertices[oV + 3] = pos.x + dim.x / 2;
      vertices[oV + 4] = pos.y + dim.y + 0.3;
      vertices[oV + 5] = pos.z;
    }

    this.globalGeometry = new THREE.BufferGeometry();

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, 3));

		const material = new THREE.LineBasicMaterial({
      color: 0xFFFFFF
    });

    this.globalMesh = new THREE.Line(
      this.globalGeometry,
      material,
      THREE.LinePieces
    );
    this.globalMesh.renderOrder = 3;

    this.scene.addSceneObject(this.globalMesh);
  }
}
