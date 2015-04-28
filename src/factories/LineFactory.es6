'use strict';

import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class LineFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
  }

  addFragment({id, from, to, enabled = true}) {
    this.fragments.push({
      id, //is needed to identify the fragment when deleting
      from,
      to,
      enabled
    });

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
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
      const from = fragment.from;
      const to = fragment.to;
      const oV = i * numElementPerVertex * numPointsPerLine; //offsetVertex

      //from
      vertices[oV + 0] = from.x;
      vertices[oV + 1] = from.y;
      vertices[oV + 2] = from.z;

      //to
      vertices[oV + 3] = to.x;
      vertices[oV + 4] = to.y;
      vertices[oV + 5] = to.z;
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
