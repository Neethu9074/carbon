'use strict';

import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class LineFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
  }

  rebuild() {
    //remove the current global mesh from the scene
    this.scene.removeSceneObject(this.globalMesh);

    //don't forget to clear the chace
    this.globalGeometry.dispose();

    //get all fragments that are enabled
    const frags = this.getLegalFragments();
    const numLines = frags.length;
    const numElementPerVertex = 3; //x, y, z
    const numPointsPerLine = 2; //from, to
    const vertices = new Float32Array(
      numLines *
      numPointsPerLine *
      numElementPerVertex
    );

    for (let i = 0; i < numLines; i++) {
      const fragment = frags[i];
      const pos = fragment.pos;
      const dim = fragment.dim;
      const oV = i * numElementPerVertex * numPointsPerLine; //offsetVertex

      //from
      vertices[oV + 0] = pos.x;
      vertices[oV + 1] = pos.y + dim.y;
      vertices[oV + 2] = pos.z;

      //to
      vertices[oV + 3] = pos.x + dim.x / 2;
      vertices[oV + 4] = pos.y + dim.y + 0.3;
      vertices[oV + 5] = pos.z;
    }

    this.globalGeometry = new THREE.BufferGeometry();
    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, numElementPerVertex));

		const material = new THREE.LineBasicMaterial({
      color: 0xFFFFFF
    });

    this.globalMesh = new THREE.Line(
      this.globalGeometry,
      material,
      THREE.LinePieces
    );

    this.scene.addSceneObject(this.globalMesh);
  }
}
