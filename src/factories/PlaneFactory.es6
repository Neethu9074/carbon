
'use strict';
import THREE from 'three';
import MeshFactory from './MeshFactory';


export default class PlaneFactory extends MeshFactory {
  constructor({scene, colorItems = [[1, 1, 1]]}) {
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

    this.colorItemsDefault = colorItems;

    //overwrite the default material
    this.material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending
    });
  }
}
