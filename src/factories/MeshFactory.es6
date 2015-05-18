
'use strict';
import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class MeshFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});

    //pivot point is at 1/2, 0, 1/2
    this.vertexPos = [[-0.5, 0, 0.5]];
    this.colorItemsDefault = [[1, 1, 1]];

    this.numElementPerVertex = 3; //x, y, z
    this.numVerticesPerFace = 6;
    this.numDifferentColors = 1;
    this.colorIndex = 0;
  }

  rebuild() {
    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const colorsPerCube = this.numDifferentColors * this.numVerticesPerFace;
    const vertices = new Float32Array(
      numCubes *
      this.vertexPos.length *
      this.numElementPerVertex
    );
    const colors = new Float32Array(
      numCubes *
      colorsPerCube *
      this.numElementPerVertex
    );

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const offset = i * this.vertexPos.length * this.numElementPerVertex;
      const colorItems = this.getColorArrayForFragment(fragment);

      this.fillVertices({
        vertices,
        pos: fragment.pos,
        dim: fragment.dim,
        offset
      });
      this.fillColors({colors, colorItems});
    }

    this.createGlobalMesh({vertices, colors});
  }

  fillVertices({vertices, offset, pos, dim}) {
    //copy positions into global array
    for (let iVertex = 0; iVertex < this.vertexPos.length; iVertex++) {
      const index = iVertex * this.numElementPerVertex + offset;
      vertices[index + 0] = this.vertexPos[iVertex][0] * dim.x + pos.x;
      vertices[index + 1] = this.vertexPos[iVertex][1] * dim.y + pos.y;
      vertices[index + 2] = this.vertexPos[iVertex][2] * dim.z + pos.z;
    }
  }

  fillColors({colors, colorItems}) {
    for (let i2 = 0; i2 < this.numDifferentColors; i2++) {
      for (let i3 = 0; i3 < this.numVerticesPerFace; i3++) {
        colors[this.colorIndex++] = colorItems[i2][0];
        colors[this.colorIndex++] = colorItems[i2][1];
        colors[this.colorIndex++] = colorItems[i2][2];
      }
    }
  }

  changeColorOfFragment(fragment, color) {
    const indexOfFragment = this.fragments.indexOf(fragment);
    const colors = this.globalGeometry.attributes.color.array;
    let colorIndex = indexOfFragment *
      this.vertexPos.length *
      this.numElementPerVertex;

    for (let i = 0; i < this.numDifferentColors; i++) {
      for (let i3 = 0; i3 < this.numVerticesPerFace; i3++) {
        colors[colorIndex++] = color[i][0];
        colors[colorIndex++] = color[i][1];
        colors[colorIndex++] = color[i][2];
      }
    }

    this.globalGeometry.attributes.color.needsUpdate = true;
  }

  getColorArrayForFragment() {
    return this.colorItemsDefault;
  }

  createGlobalMesh({vertices, colors}) {
    this.scene.removeSceneObject(this.globalMesh);

    //update the geometies position array
    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    //update the geometies color array
    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, this.numElementPerVertex));

    this.scene.addSceneObject(this.globalMesh);
    this.colorIndex = 0;
  }
}
