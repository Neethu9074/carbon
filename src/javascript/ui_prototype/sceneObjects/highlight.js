'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import Particles from './risingParticles';
import * as materials from '../materials';
import * as math from '../math';


class Hightlight extends SceneObject {
	constructor(app, obj) {
		const dim = obj.dimension;
		const pos = obj.position.clone();
    pos.sub(new THREE.Vector3(dim.x / 2, 0, -dim.z / 2));


		//call super constructor
		super(app, 'ground', pos, dim);

    const points = [];
    for (let x = 0; x < dim.x; x += 0.1) {
      points.push( new THREE.Vector3(x, 0, 0) );
      points.push( new THREE.Vector3(x, 0, dim.z) );
    }
    for (let y = 0; y < dim.z; y += 0.1) {
      points.push( new THREE.Vector3(0, 0, y) );
      points.push( new THREE.Vector3(dim.x, 0, y) );
    }

		this.particles = new Particles(app, points);
    this.particles.pointCloud.position.copy(pos);
	}

	dispose() {
		super.dispose();

    this.particles.dispose();
    this.partcles = null;
	}
}

export default Hightlight;
