'use strict';

import THREE from 'three';
import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

let index = 0;


export default class LineFactory extends AbstractMeshCreationFactory {

  constructor({scene}) {
    super({scene});

    this.setMaterial(new THREE.LineBasicMaterial({
      color: 0xFFFFFF
    }));

    this.numElementPerVertex = 3; //x, y, z
    this.numPointsPerLine = 2; //from and to

    this.globalMesh = new THREE.Line(
      this.globalGeometry,
      this.material,
      THREE.LinePieces
    );
    this.globalMesh.matrixAutoUpdate = false;
  }

  addFragment({id, points, enabled = true}) {
    this.fragments.push({
      id, //is needed to identify the fragment when deleting
      points,
      enabled
    });

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  rebuild() {
    //reset index
    index = 0;

    //remove the current global mesh from the scene
    this.scene.removeSceneObject(this.globalMesh);

    //get all fragments that are enabled
    const frags = this.getLegalFragments();
    const vertices = [];

    for (let i = 0; i < frags.length; i++) {
      const fragment = frags[i];
      this.copyLineToGLobalVerticArray(vertices, fragment);
    }

    this.createGlobalMesh(new Float32Array(vertices));
  }

  copyLineToGLobalVerticArray(vertices, fragment){
    for (let i = 0; i < fragment.points.length; i++) {
      const point = fragment.points[i];
      vertices[index++] = point.x;
      vertices[index++] = point.y;
      vertices[index++] = point.z;
    }
  }

  createGlobalMesh(vertices) {
    this.scene.removeSceneObject(this.globalMesh);

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    this.scene.addSceneObject(this.globalMesh);
  }
}
