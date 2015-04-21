'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import Particles from './risingParticles';
import Mirror from '../../lib/Mirror';
import * as materials from '../materials';
import * as math from '../math';


class Ground extends SceneObject {
	constructor() {
		const pos = new THREE.Vector3(10, -0.15, 10);
		const dim = new THREE.Vector3(1000, 0, 1000);

		//call super constructor
		super('ground', pos, dim);

		//bind methods
		this.update = this.update.bind(this);
		this.mirrorUpdateFreq = 5;
		this.mirrorUpdateCounter = 0;

		const geo = new THREE.PlaneBufferGeometry(dim.x, dim.z, 1, 1);
		const plane = new THREE.Mesh(geo, materials.groundMaterial);

		plane.rotation.x = -90 * math.DegToRad;
		plane.position.copy(pos);
		this.setStatic(plane);

		this.ground = plane;
		this.app.scene.add(plane);

		const points = [];
		for (let x = -25; x < 25; x++) {
			for (let y = -25; y < 25; y++) {
				points.push( new THREE.Vector3(x * 20, 0, y * 20) );
			}
		}
		this.particles = new Particles(points);

		this.createMirror();
		const mirrorMesh = new THREE.Mesh(geo, this.mirror.material);
		mirrorMesh.add(this.mirror);
		mirrorMesh.rotation.x = -90 * math.DegToRad;
		mirrorMesh.position.set(0, -0.2, 0);
		this.app.scene.add(mirrorMesh);

		this.setupEvents();
	}

	createMirror() {
		this.mirror = new Mirror(
			this.app.webGLRenderer,
			this.app.mainCamera,
			this.app.scene, {
				clipBias: 0.03
			});
	}

	setupEvents() {
		this.subscription = this.app.emitter.on('endUpdate').subscribe(
			this.update,
			function() {},
			function() {}
    );
	}

	update() {
		if(this.mirrorUpdateCounter >= this.mirrorUpdateFreq) {
			this.mirrorUpdateCounter = 0;

			//only draw reflections on desktop device
			if(!this.app.isMobileDevice) {
				this.mirror.render();
			}
		}

		this.mirrorUpdateCounter++;
	}

	resize(width, height) {
		this.mirror.resize(width, height);
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
