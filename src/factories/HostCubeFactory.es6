
'use strict';
import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';

//pivot point is at 1/2, 0, 1/2
const vertexPos = [
  //front
  [-0.5, 0, 0.5],
  [0.5, 0, 0.5],
  [0.5, 1, 0.5],

  [-0.5, 0, 0.5],
  [0.5, 1, 0.5],
  [-0.5, 1, 0.5],

  //top
  [-0.5, 1, 0.5],
  [0.5, 1, 0.5],
  [0.5, 1, -0.5],

  [-0.5, 1, 0.5],
  [0.5, 1, -0.5],
  [-0.5, 1, -0.5],

  //left
  [-0.5, 0, 0.5],
  [-0.5, 0, -0.5],
  [-0.5, 1, -0.5],

  [-0.5, 0, 0.5],
  [-0.5, 1, -0.5],
  [-0.5, 1, 0.5]
];

const colorItemsOk = [
  [0.184, 0.64, 0.71], //front
  [0.212, 0.71, 0.745], //top
  [0.204, 0.694, 0.75] //left
];

const colorItemsWarning = [
  [0.89, 0.73, 0.02], //front
  [0.89, 0.824, 0.078], //top
  [0.89, 0.827, 0.14] //left
];

const colorItemsDanger = [
  [0.878, 0.145, 0], //front
  [0.878, 0.31, 0], //top
  [0.878, 0.262, 0] //left
];


export default class HostCubeFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
  }

  addFragment({id, pos, dim, health, enabled = true}) {
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
    //remove the current global mesh from the scene
    this.scene.removeSceneObject(this.globalMesh);

    //don't forget to clear the chace
    this.globalGeometry.dispose();

    //get all enabled fragments
    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const numElementPerVertex = 3; //x, y, z
    const numFacesPerCube = 3;
    const numVerticesPerFace = 6;
    const colorsPerCube = colorItemsOk.length * numVerticesPerFace;
    const vertices = new Float32Array(
      numCubes *
      vertexPos.length *
      numElementPerVertex
    );
    const colors = new Float32Array(
      numCubes *
      colorsPerCube *
      numElementPerVertex
    );
    let colorIndex = 0;

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      let colorItems = colorItemsOk;
      if(fragment.health === 'warning') {
        colorItems = colorItemsWarning;
      } else if(fragment.health === 'danger') {
        colorItems = colorItemsDanger;
      }

      const pos = fragment.pos;
      const dim = fragment.dim;
      const oV = i * vertexPos.length * numElementPerVertex; //offsetVertex

      //copy positions into global array
      for (let iVertex = 0; iVertex < vertexPos.length; iVertex++) {
        const index = iVertex * numElementPerVertex + oV;
        vertices[index + 0] = vertexPos[iVertex][0] * dim.x + pos.x;
        vertices[index + 1] = vertexPos[iVertex][1] * dim.y + pos.y;
        vertices[index + 2] = vertexPos[iVertex][2] * dim.z + pos.z;
      }


      for (let i2 = 0; i2 < numFacesPerCube; i2++) {
        for (let i3 = 0; i3 < numVerticesPerFace; i3++) {
          colors[colorIndex++] = colorItems[i2][0];
          colors[colorIndex++] = colorItems[i2][1];
          colors[colorIndex++] = colorItems[i2][2];
        }
      }
    }

    this.globalGeometry = new THREE.BufferGeometry();

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, numElementPerVertex));

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, numElementPerVertex));

    this.globalGeometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.globalMesh = new THREE.Mesh(this.globalGeometry, material);
    this.globalMesh.renderOrder = 2;

    this.scene.addSceneObject(this.globalMesh);
  }
}
