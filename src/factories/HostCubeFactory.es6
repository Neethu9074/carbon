'use strict';

import THREE from 'three';

import AbstractMeshCreationFactory from './AbstractMeshCreationFactory';


export default class HostCubeFactory extends AbstractMeshCreationFactory {
  constructor({scene}) {
    super({scene});
  }

  rebuild() {
    const vertexPos = [
      //front
      [0, 0, 1],
      [1, 0, 1],
      [1, 1, 1],

      [0, 0, 1],
      [1, 1, 1],
      [0, 1, 1],

      //top
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],

      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0],

      //left
      [0, 0, 1],
      [0, 0, 0],
      [0, 1, 0],

      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1]
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

    this.scene.removeSceneObject(this.globalMesh);
    this.globalGeometry.dispose();

    const frags = this.getLegalFragments();
    const numCubes = frags.length;
    const vertices = new Float32Array(numCubes * vertexPos.length * 3);
    const colors = new Float32Array(numCubes * colorItems.length * 3);

    for (let i = 0; i < numCubes; i++) {
      const fragment = frags[i];
      const pos = fragment.pos;
      const dim = fragment.dim;
      const oV = i * vertexPos.length * 3;
      const oC = i * colorItems.length * 3;

      //copy positions into global array
      for (let iVertex = 0; iVertex < vertexPos.length; iVertex++) {
        vertices[iVertex * 3 + oV + 0] =
          vertexPos[iVertex][0] + pos.x * dim.x - 0.5;

        vertices[iVertex * 3 + oV + 1] =
          vertexPos[iVertex][1] + pos.y * dim.y;

        vertices[iVertex * 3 + oV + 2] =
          vertexPos[iVertex][2] + pos.z * dim.z - 0.5;
      }

      for (let iColor = 0; iColor < colorItems.length; iColor++) {
        colors[iColor * 3 + oC + 0] = colorItems[iColor][0];
        colors[iColor * 3 + oC + 1] = colorItems[iColor][1];
        colors[iColor * 3 + oC + 2] = colorItems[iColor][2];
      }
    }

    this.globalGeometry = new THREE.BufferGeometry();

    this.globalGeometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, 3));

    this.globalGeometry.addAttribute('color',
      new THREE.BufferAttribute(colors, 3));

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
