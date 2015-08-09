

import THREE from 'three';
import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

import {hexToRGBNormalized} from 'in-services/converters';

const defaultColor = hexToRGBNormalized('#6c7b83');
const defaultHighlightColor = hexToRGBNormalized('#FFFFFF');

let index = 0;


export default class LineFactory extends AbstractMeshCreationFactory {

  constructor({scene}) {
    super({scene});

    this.setMaterial(new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors
    }));

    if(navigator.platform.indexOf('Win') < 0) {
      this.material.linewidth = 2;
    }

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

  addFragment({id, points, highlighted, highlightColor, color, enabled = true}) {
    const match = this.getFragment(id);
    if(match) {
      match.points = points || match.points;
      match.color = color || match.color;
      match.highlighted = highlighted || match.highlighted;
      match.highlightColor = highlightColor || match.highlightColor;

      //rebuild on property change
      this.rebuildGlobalMesh = true;

    } else {
      super.addFragment({
        id, //is needed to identify the fragment when deleting
        points,
        highlighted,
        highlightColor,
        color,
        enabled
      });
    }
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
    let color = this.getFragmentColor(fragment);
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

  getFragmentColor(fragment) {
    //if the fragment is highlighted -> use highlightColor
    if(fragment.highlighted) {
      return fragment.highlightColor || defaultHighlightColor;
    }
    return fragment.color || defaultColor;
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
