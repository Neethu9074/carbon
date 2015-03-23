'use strict';

import THREE from 'three.js';

import sceneObject from './sceneObject';
import * as materials from '../materials';
import * as math from '../math';

import textS from './test.glsl';

class Ground extends sceneObject {
	constructor(app) {
		var pos = new THREE.Vector3(490, -0.1, -490);
		var dim = new THREE.Vector3(1000, 0, 1000);

		//call super constructor
		super(app, 'ground', pos, dim);


		var geo = new THREE.PlaneBufferGeometry(dim.x, dim.z, 1, 1);
		var plane = new THREE.Mesh(geo, materials.groundMaterial);

		plane.rotation.x = -90 * math.DegToRad;
		plane.position.copy(pos);
		this.setStatic(plane);

		this.ground = plane;
		this.app.scene.add(plane);

		console.log(textS)
	}

	dispose() {
		super.dispose();

		this.app.scene.remove(this.ground);

		this.ground.geometry.dispose();
		this.ground.material.dispose();
		this.ground = null;
	}
}

export default Ground;
