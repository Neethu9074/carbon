'use strict';

import THREE from 'three.js';
import obj from '../lib/OBJLoader';

import warningObjectPath from '../../obj/warning.obj';
import errorObjectPath from '../../obj/error.obj';
import cubeObjectPath from '../../obj/cube.obj';
import cubeBoundageObjectPath from '../../obj/cubeBoundage.obj';

export function load (onFinished) {
  onFinished();
}

/*
function loadModel(model, set, onFinished) {
  var loader = new THREE.OBJLoader();
  loader.load(
    model,
    function(object) {
      object = object.children[0];
      set(object);
      onFinished();
    }
  );
}
*/
