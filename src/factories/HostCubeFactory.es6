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

const colorItems = [
  //front
  [0.134, 0.16, 0.2], //RGB -> 34, 41, 51
  [0.134, 0.16, 0.2],
  [0.134, 0.16, 0.2],

  [0.134, 0.16, 0.2],
  [0.134, 0.16, 0.2],
  [0.134, 0.16, 0.2],

  //top
  [0.2, 0.25, 0.278], //RGB -> 51, 64, 71
  [0.2, 0.25, 0.278],
  [0.2, 0.25, 0.278],

  [0.2, 0.25, 0.278],
  [0.2, 0.25, 0.278],
  [0.2, 0.25, 0.278],

  //left
  [0.188, 0.224, 0.259], //RGB -> 48, 57, 66
  [0.188, 0.224, 0.259],
  [0.188, 0.224, 0.259],

  [0.188, 0.224, 0.259],
  [0.188, 0.224, 0.259],
  [0.188, 0.224, 0.259]
];

export default class HostCubeFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
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
    const vertices = new Float32Array(
      numCubes *
      vertexPos.length *
      numElementPerVertex
    );
    const colors = new Float32Array(
      numCubes *
      colorItems.length *
      numElementPerVertex
    );

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const pos = fragment.pos;
      const dim = fragment.dim;
      const oV = i * vertexPos.length * numElementPerVertex; //offsetVertex
      const oC = i * colorItems.length * numElementPerVertex; //offsetColor

      //copy positions into global array
      for (let iVertex = 0; iVertex < vertexPos.length; iVertex++) {
        const index = iVertex * numElementPerVertex + oV;
        vertices[index + 0] = vertexPos[iVertex][0] + pos.x * dim.x;
        vertices[index + 1] = vertexPos[iVertex][1] + pos.y * dim.y;
        vertices[index + 2] = vertexPos[iVertex][2] + pos.z * dim.z;
      }

      //copy colors into global array
      for (let iColor = 0; iColor < colorItems.length; iColor++) {
        const index = iColor * numElementPerVertex + oC;
        colors[index + 0] = colorItems[iColor][0];
        colors[index + 1] = colorItems[iColor][1];
        colors[index + 2] = colorItems[iColor][2];
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
      opacity: 0.9,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.globalMesh = new THREE.Mesh(this.globalGeometry, material);
    this.globalMesh.renderOrder = 2;

    this.scene.addSceneObject(this.globalMesh);
  }
}
