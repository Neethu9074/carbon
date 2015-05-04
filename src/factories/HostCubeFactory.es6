
'use strict';
import THREE from 'three';
import MeshFactory from './MeshFactory';

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


export default class HostCubeFactory extends MeshFactory {
  constructor({scene}) {
    super({scene});

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

    //overwrite the default material
    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });

    this.numDifferentColors = 3;
  }

  getColorArrayForFragment(fragment) {
    const health = fragment.health;

    if(health === 'warning') {
      return colorItemsWarning;
    } else if(health === 'danger') {
      return colorItemsDanger;
    }
    return colorItemsOk;
  }
}
