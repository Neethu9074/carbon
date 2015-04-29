
'use strict';
import THREE from 'three';

import PlaneFactory from './PlaneFactory';


export default class HostCubeFactory extends PlaneFactory {
  constructor({scene}) {
    super({scene});

    //overwrite teh default material
    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });

    this.vertexPos = [
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

    this.colorItemsOk = [
      [0.184, 0.64, 0.71], //front
      [0.212, 0.71, 0.745], //top
      [0.204, 0.694, 0.75] //left
    ];

    this.colorItemsWarning = [
      [0.89, 0.73, 0.02], //front
      [0.89, 0.824, 0.078], //top
      [0.89, 0.827, 0.14] //left
    ];

    this.colorItemsDanger = [
      [0.878, 0.145, 0], //front
      [0.878, 0.31, 0], //top
      [0.878, 0.262, 0] //left
    ];

    this.numElementPerVertex = 3; //x, y, z
    this.numFacesPerCube = this.colorItemsOk.length;
    this.numVerticesPerFace = 6;
    this.colorIndex = 0;
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
}
