'use strict';

import THREE from 'three.js';
import '../lib/OBJLoader';
import * as obj from './obj'

import cubeObjectPath from '../../obj/cube.obj';
import collObjCubePath from '../../obj/collisionObjectCube.obj';
import groundEffectPath from '../../obj/groundEffect.obj';


export function load(onFinished) {
	loadModel('bundle/' + groundEffectPath, obj.setGroundEffect,
		function() {
			loadModel('bundle/' + cubeObjectPath, obj.setCube,
				function() {
					loadModel('bundle/' + collObjCubePath, obj.setCollisionObjectCube,
						function() {
							onFinished();
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
