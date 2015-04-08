'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import * as materials from '../materials';


class DataPackagePathAnimation extends SceneObject {
	constructor(path) {
		const pos = new THREE.Vector3(0, 0, 0);
		const dim = new THREE.Vector3(1, 1, 1);

		//call super constructor
		super('ground', pos, dim);

		//save reference for later use
		this.path = path;

		this.lerpPercentage = 0;
		this.index = 0;
		this.from = this.toVector3(path[0]);
		this.to = this.toVector3(path[1]);
		this.calculateSpeed();

		this.init();

		//bind methods
		this.update = this.update.bind(this);

		this.setupEvents();
	}

	toVector3(pathPoint) {
		return new THREE.Vector3(pathPoint[0], 0.1, pathPoint[1]);
	}

	calculateSpeed() {
		//get the distance/length from a to b
		const distance = new THREE.Vector3()
			.copy(this.to)
			.sub(this.from).length();

		this.speed = 6 / distance;
	}

	init() {
		const startPos = this.from;

		const geometry = new THREE.SphereGeometry(0.25, 4, 4);
		const material = new THREE.MeshBasicMaterial({
			color: 0xffff00
		});
		const sphere = new THREE.Mesh(geometry, material);
		sphere.position.copy(startPos);
		sphere.lookAt(this.toVector3(this.to));

		this.mesh = sphere;
		this.app.scene.add(this.mesh);
	}

	setupEvents() {
		this.subscription = this.app.emitter.on('endUpdate').subscribe(
			this.update,
			function() {},
			function() {}
		);
	}

	update(data) {
		const dt = data.dt;

		//store 'locally' to give a better overview of the code
		let lerpFactor = this.lerpPercentage;
		const path = this.path;

		const newPos = new THREE.Vector3()
      .copy(this.from)
			.lerp(this.to, this.lerpPercentage);

		lerpFactor += dt * this.speed; //speed
		this.lerpPercentage = Math.min(1, lerpFactor); //[0, 1]

		//if you reached the end, go to next point
		if (lerpFactor >= 1) {
			//begin at 0%
			this.lerpPercentage = 0;
			this.index++;
			//reached the end? begin from start! (loop)
			if (this.index >= path.length - 1) {
				this.index = 0;
			}
			this.from = this.toVector3(path[this.index]);
			this.to = this.toVector3(path[this.index + 1]);

			//adjust speed
			this.calculateSpeed();
		}

		//and finally, set the new interpolated position
		this.mesh.position.copy(newPos);
	}

	dispose() {
		super.dispose();

    this.subscription.dispose();
		this.app.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();

    this.speed = null;
    this.path = null;
		this.lerpPercentage = null;
		this.index = null;
		this.from = null;
		this.to = null;
	}
}

export default DataPackagePathAnimation;
