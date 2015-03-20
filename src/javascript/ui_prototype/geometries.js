'use strict';

import THREE from 'three.js';

import _ from 'lodash';


export const cubeGeometry = ( () => {
  const box = new THREE.BoxGeometry(1, 1, 1, 1);

  _.forEach(box.vertices, vertex => {
    vertex.y += 0.5;
  } );

  return box;
})();

export let globalHostGeometry = new THREE.Geometry();
export const globalHostContainer = new THREE.Object3D();
