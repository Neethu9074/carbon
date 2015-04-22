'use strict';

import THREE from 'three.js';
import '../lib/OBJLoader';
import * as obj from './obj'

import cubeObjectPath from '../../obj/cube.obj';
import collObjCubePath from '../../obj/collisionObjectCube.obj';
import groundEffectPath from '../../obj/cubeGroundPlane.obj';


//load all resources synchronous and call onFinished when loading completed
export function load(onFinished) {
	loadModel(groundEffectPath, obj.setGroundEffect,
		function() {
			loadModel(cubeObjectPath, obj.setCube,
				function() {
					loadModel(collObjCubePath,
						obj.setCollisionObjectCube,
						function() {
							onFinished();
						});
				});
		}
  );
}

//loads a obj file asynchronous
function loadModel(model, set, onFinished) {
	const loader = new THREE.OBJLoader();
	loader.load(
		model,
		function(object) {
			object = object.children[0];
			set(object);
			onFinished();
		}
	);
}
