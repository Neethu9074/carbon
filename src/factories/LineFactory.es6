'use strict';

import THREE from 'three';
import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

import {hexToRGBNormalized} from 'instana-ui-services/converters';

const defaultColor = hexToRGBNormalized('#435964');
const highlightColor = hexToRGBNormalized('#FFFFFF');

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

  addFragment({id, points, highlighted, enabled = true}) {
    this.fragments.push({
      id, //is needed to identify the fragment when deleting
      points,
      highlighted,
      enabled
    });

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  highlightFragment(id, highlighted) {
    const match = this.getFragment(id);
    if(!match) {
      return;
    }

    match.highlighted = highlighted;
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
    let color = fragment.highlighted ? highlightColor : defaultColor;
    const yManipulator = fragment.highlighted ? 0 : -0.025;

    for (let i = 0; i < fragment.points.length; i++) {
      const point = fragment.points[i];
      colors[index] = color.r;
      vertices[index++] = point.x;
      colors[index] = color.g;
      vertices[index++] = point.y + yManipulator;
      colors[index] = color.b;
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
