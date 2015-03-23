'use strict';

import THREE from 'three.js';

import _ from 'lodash';


export const cubeGeometry = ( () => {
  const box = new THREE.BoxGeometry(1, 1, 1, 1);

  //translate the pivotPoint frtom (middle) to (middle, bottom)
  _.forEach(box.vertices, vertex => {
    vertex.y += 0.5;
  });

  return box;
})();

export const containerLabelGeometry = ( () => {
  const plane = new THREE.PlaneGeometry(1, 1, 1, 1);

  //translate the pivotPoint frtom (middle) to (left, bottom)
  _.forEach(plane.vertices, vertex => {
    vertex.y += 0.5;
    vertex.x += 0.5;
  });

  return new THREE.BufferGeometry().fromGeometry(plane);
})();

export let globalHostGeometry = new THREE.Geometry();
export const globalHostContainer = new THREE.Object3D();
