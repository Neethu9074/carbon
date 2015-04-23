'use strict';

import THREE from 'three.js';

import AbstractMeshCreationFactory from './abstractMeshCreationFactory';

//singleton
let instance;
export function getInstance() {
	if (!instance) {
    instance = new HostCubeFactory();
  }
  return instance;
}


export default class HostCubeFactory extends AbstractMeshCreationFactory {

	constructor() {
		super();
	}

	rebuild() {
		//var t1 = console.time('1');
		this.globalGeometry.dispose();

		const frags = this.getLegalFragments();

		const mergedGeometry = new THREE.Geometry();
		for (let i = 0; i < frags.length; i++) {
			const cube = frags[i].cube;
			mergedGeometry.merge(cube.geometry, cube.matrix);
		}

		this.globalGeometry = new THREE.BufferGeometry()
			.fromGeometry(mergedGeometry);
		const material = new THREE.MeshBasicMaterial({
			color: 0xF0FF00,
			transparent: true,
			opacity: 0.5,
			blending: THREE.NormalBlending,
			side: THREE.DoubleSide
		});

		this.globalMesh = new THREE.Mesh(this.globalGeometry, material);
		//var t2 = console.timeEnd('1');
	}
}
