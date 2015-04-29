
'use strict';
import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class PlaneFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});

    //pivot point is at 1/2, 0, 1/2
    this.vertexPos = [
      [-0.5, 0, 0.5],
      [0.5, 0, 0.5],
      [0.5, 0, -0.5],

      [-0.5, 0, 0.5],
      [0.5, 0, -0.5],
      [-0.5, 0, -0.5]
    ];

    this.colorItemsOk = [
      [0.9, 0.1, 0.1]
    ];

    this.colorItemsWarning = [
      [0.51, 0.47, 0.08]
    ];

    this.colorItemsDanger = [
      [0.5, 0.22, 0.1]
    ];

    this.numElementPerVertex = 3; //x, y, z
    this.numFacesPerCube = this.colorItemsOk.length;
    this.numVerticesPerFace = 6;
    this.colorIndex = 0;
  }

  addFragment({id, pos, dim, health, enabled = true}) {
    if(health === 'ok') {
      enabled = false;
    }
    this.fragments.push({
      id, //is needed to identify the fragment when deleting
      pos,
      dim,
      health,
      enabled
    });

    //set rebuild to true
    //so that the mesh will be generated on the next event
    this.rebuildGlobalMesh = true;
  }

  rebuild() {
    this.clearGlobalMesh();

    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const colorsPerCube = this.numFacesPerCube * this.numVerticesPerFace;
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
      const pos = fragment.pos;
      const dim = fragment.dim;
      const offset = i * this.vertexPos.length * this.numElementPerVertex;
      const colorItems = this.getColorArray(fragment.health);

      this.fillVertices({vertices, pos, dim, offset});
      this.fillColors({colors, cubeIndex: i, colorItems});
    }

    this.createGlobalMesh(vertices, colors);
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
    for (let i2 = 0; i2 < this.numFacesPerCube; i2++) {
      for (let i3 = 0; i3 < this.numVerticesPerFace; i3++) {
        colors[this.colorIndex++] = colorItems[i2][0];
        colors[this.colorIndex++] = colorItems[i2][1];
        colors[this.colorIndex++] = colorItems[i2][2];
      }
    }
  }

  clearGlobalMesh() {
    //remove the current global mesh from the scene
    this.scene.removeSceneObject(this.globalMesh);

    //don't forget to clear the chace
    this.globalGeometry.dispose();
  }

  getColorArray(health) {
    if(health === 'warning') {
      return this.colorItemsWarning;
    } else if(health === 'danger') {
      return this.colorItemsDanger;
    }
    return this.colorItemsOk;
  }

  createGlobalMesh(vertices, colors) {
    this.globalGeometry = new THREE.BufferGeometry();

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, this.numElementPerVertex));

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, this.numElementPerVertex));

    this.globalGeometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });

    this.globalMesh = new THREE.Mesh(this.globalGeometry, material);
    this.globalMesh.renderOrder = 2;

    this.scene.addSceneObject(this.globalMesh);
    this.colorIndex = 0;
  }
}
