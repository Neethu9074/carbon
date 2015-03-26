'use strict';

import THREE from 'three.js';

import * as obj from './obj';

import _ from 'lodash';


export const cubeGeometry = ( () => {
  const box = new THREE.BoxGeometry(1, 1, 1, 1);

  //translate the pivotPoint frtom (middle) to (middle, bottom)
  _.forEach(box.vertices, vertex => {
    vertex.y += 0.5;
  });

  return box;
})();

export let globalHostGeometry = new THREE.BufferGeometry();
export const globalHostContainer = new THREE.Object3D();
