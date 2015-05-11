'use strict';

import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class LineFactory extends AbstractMeshCreationFactory {

  constructor({scene}) {
    //overwrite teh default material
    this.material = new THREE.LineBasicMaterial({
      color: 0xFFFFFF
    });
    super({scene});

    this.numElementPerVertex = 3; //x, y, z
    this.numPointsPerLine = 2; //from and to

    this.globalMesh = new THREE.Line(
      this.globalGeometry,
      this.material,
      THREE.LinePieces
    );
    this.globalMesh.matrixAutoUpdate = false;
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

    //get all fragments that are enabled
    const frags = this.getLegalFragments();
    const numLines = frags.length;
    const vertices = new Float32Array(
      numLines *
      this.numPointsPerLine *
      this.numElementPerVertex
    );

    for (let i = 0; i < numLines; i++) {
      const fragment = frags[i];
      this.copyLineToGLobalVerticArray(vertices, fragment, i);
    }

    this.createGlobalMesh(vertices);
  }

  copyLineToGLobalVerticArray(vertices, fragment, index){
    const from = fragment.from;
    const to = fragment.to;
    const offset = index * this.numElementPerVertex * this.numPointsPerLine;

    //from
    vertices[offset + 0] = from.x;
    vertices[offset + 1] = from.y;
    vertices[offset + 2] = from.z;

    //to
    vertices[offset + 3] = to.x;
    vertices[offset + 4] = to.y;
    vertices[offset + 5] = to.z;
  }

  createGlobalMesh(vertices) {
    this.scene.removeSceneObject(this.globalMesh);

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    this.scene.addSceneObject(this.globalMesh);
  }
}
