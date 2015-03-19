'use strict';

import THREE from 'three.js';

import 'lodash';


export const cubeGeometry = ( () => {
  const box = new THREE.BoxGeometry(1, 1, 1, 1);

  _.forEach(box.vertices, vertex => {
    vertex.y += 0.5;
  } );

  return box;
})();

export const containerLabelGeometry =
  new THREE.PlaneBufferGeometry(10, 1, 1, 1);
