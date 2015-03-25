'use strict';

import THREE from 'three.js';
import '../lib/OBJLoader';
import * as obj from './obj'

import warningObjectPath from '../../obj/warning.obj';
import errorObjectPath from '../../obj/error.obj';
import cubeObjectPath from '../../obj/cube.obj';
import collObjCube from '../../obj/collisionObjectCube.obj';

export function load(onFinished) {
	loadModel('bundle/' + warningObjectPath, obj.setStateWarningSymbol,
		function() {
			loadModel('bundle/' + errorObjectPath, obj.setStateErrorSymbol,
				function() {
					loadModel('bundle/' + cubeObjectPath, obj.setCube,
						function() {
							loadModel('bundle/' + collObjCube, obj.setCollisionObjectCube,
								function() {
									onFinished();
								});
						});
				});
		}
  );
}


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
