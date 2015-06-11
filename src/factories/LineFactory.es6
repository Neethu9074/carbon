'use strict';

import THREE from 'three';
import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

let index = 0;


export default class LineFactory extends AbstractMeshCreationFactory {

  constructor({scene}) {
    super({scene});

    this.setMaterial(new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: 2
    }));

    this.numElementPerVertex = 3; //x, y, z
    this.globalMesh = new THREE.Line(
      this.globalGeometry,
      this.material,
      THREE.LinePieces
    );
    this.globalMesh.matrixAutoUpdate = false;
    this.globalMesh.renderOrder = 2;
    this.globalMesh.frustumCulled = false;
  }

  addFragment({id, points, color, enabled = true}) {
    this.fragments.push({
      id, //is needed to identify the fragment when deleting
      points,
      color: color,
      enabled
    });

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  highlightFragment(id, highlight) {
    const match = this.getFragment(id);
    if(!match) {
      return;
    }

    match.highlighted = highlight;
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
    const colors = [];

    for (let i = 0; i < frags.length; i++) {
      const fragment = frags[i];
      this.copyLineAttributesToGlobalArray(vertices, colors, fragment);
    }

    this.createGlobalMesh(new Float32Array(vertices), new Float32Array(colors));
  }

  copyLineAttributesToGlobalArray(vertices, colors, fragment){
    let color = fragment.color;

    for (let i = 0; i < fragment.points.length; i++) {
      const point = fragment.points[i];
      colors[index] = color[0];
      vertices[index++] = point.x;
      colors[index] = color[1];
      vertices[index++] = point.y;
      colors[index] = color[2];
      vertices[index++] = point.z;
    }
  }

  createGlobalMesh(vertices, colors) {
    this.scene.removeSceneObject(this.globalMesh);

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, this.numElementPerVertex));

    this.scene.addSceneObject(this.globalMesh);
  }
}
