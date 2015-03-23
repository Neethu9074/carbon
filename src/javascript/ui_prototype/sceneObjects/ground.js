'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import Particles from './risingParticles';
import * as materials from '../materials';
import * as math from '../math';


class Ground extends SceneObject {
	constructor(app) {
		const pos = new THREE.Vector3(490, -0.1, -490);
		const dim = new THREE.Vector3(1000, 0, 1000);

		//call super constructor
		super(app, 'ground', pos, dim);


		const geo = new THREE.PlaneBufferGeometry(dim.x, dim.z, 1, 1);
		const plane = new THREE.Mesh(geo, materials.groundMaterial);

		plane.rotation.x = -90 * math.DegToRad;
		plane.position.copy(pos);
		this.setStatic(plane);

		this.ground = plane;
		this.app.scene.add(plane);

		const points = [];
		for (let x = 0; x < 50; x++) {
			for (let y = 0; y < 50; y++) {
				points.push( new THREE.Vector3(x * 20, 0, y * 20) );
			}
		}
		this.particles = new Particles(app, points);
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
