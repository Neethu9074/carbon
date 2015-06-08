
'use strict';
import THREE from 'three';
import CubeFactory from './CubeFactory';

const colorItemsBlue = [
  [0.184, 0.64, 0.71], //front
  [0.212, 0.71, 0.745], //top
  [0.204, 0.694, 0.75] //left
];

const colorItemsDarkerBlue = [
  [0.14, 0.6, 0.68], //front
  [0.2, 0.68, 0.7], //top
  [0.19, 0.6, 0.7] //left
];


export default class LayerFactory extends CubeFactory {
  constructor({scene}) {
    super({scene});
  }

  getColorArrayForFragment(fragment) {
    if(fragment.layerIndex % 2 === 0) {
      return colorItemsBlue;
    } else {
      return colorItemsDarkerBlue;
    }
  }
}
