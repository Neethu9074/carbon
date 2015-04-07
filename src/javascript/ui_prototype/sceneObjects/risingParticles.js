'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import vertex from '../shader/risingParticlesVertex.glsl';
import fragment from '../shader/risingParticlesFragment.glsl';

import _ from 'lodash';


class RisingParticles extends SceneObject {
	constructor(positions) {
		const pos = new THREE.Vector3(-10, 0, 10);
		const dim = new THREE.Vector3(1, 0, 1);

		//call super constructor
		super('rising particles', pos, dim);

		this.uniforms = {
			amplitude: {
				type: 'f',
				value: 1.0
			}
		};
		this.pointCloud = this.createPointCloud(this.uniforms, positions);
		this.pointCloud.position.copy(pos);

		this.app.scene.add(this.pointCloud);
		this.registerEvents();
	}

	createPointCloud(uniforms, positions) {
		const geometry = new THREE.BufferGeometry();
		let geoPos = new Float32Array(positions.length * 3);

		let index = 0;
		for (let i = 0; i < positions.length; i++) {
			const position = positions[i];
			geoPos[index] = position.x;
			geoPos[index + 1] = Math.random() * 10;
			geoPos[index + 2] = -position.z;

			index += 3;
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));

		const material = this.createMaterial(uniforms);
		const particleSystem = new THREE.PointCloud(geometry, material);
		return particleSystem;
	}

	createMaterial(uniforms) {
		const shaderMaterial =
			new THREE.ShaderMaterial({
				vertexShader: vertex,
				fragmentShader: fragment,
				uniforms: uniforms,
				transparent: true
			});

		return shaderMaterial;
	}

	registerEvents() {
    const update = this.update;
		const uniforms = this.uniforms;
		this.subscription = this.app.emitter.on('endUpdate').subscribe(
			function(data) {
				update(uniforms, data.dt);
			},
			function() {},
			function() {}
    );
  }

	update(uniforms, dt) {
		const dTime = dt;
		const maxHeight = 5;

		uniforms.amplitude.value += dTime; // * speed
		if (uniforms.amplitude.value > maxHeight) {
			uniforms.amplitude.value = 0;
		}
	}

	dispose() {
		this.app.scene.remove(this.pointCloud);

		this.subscription.dispose();

		super.dispose();

		this.pointCloud.geometry.dispose();
		this.pointCloud.material.dispose();
		this.pointCloud = null;
		this.uniforms = null;
	}
}

export default RisingParticles;
