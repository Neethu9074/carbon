'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import systemImagePath from '../../../images/icon_system.png';
import {
	createLogger
}
from '../../log';
const logger = createLogger('cubeConnection.js');


class CubeConnection extends SceneObject {
	constructor(app, a, b) {

		//call super constructor
		super(app, 'ground', a.position, a.dimension);

		logger.info('connect', a.ID, 'with', b.ID);
		this.path = this.createPath([a.position, b.position]);
    app.scene.add(this.path);
	}

	createPath(points) {
		//you need at least two points to create a line
		if (points.length < 2) {
			return;
		}


		var geometry = new THREE.BufferGeometry();
		var material = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors
		});

		var positions = new Float32Array(points.length * 3);
		var colors = new Float32Array(points.length * 3);
		for (let i = 0; i < points.length; i++) {
			var x = points[i].x;
			var y = points[i].y + 4;
			var z = points[i].z;

			// positions
			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;

			// colors
			colors[i * 3] = (x / 10) + 0.5;
			colors[i * 3 + 1] = (y / 10) + 0.5;
			colors[i * 3 + 2] = (z / 10) + 0.5;
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

		return new THREE.Line(geometry, material);
	}

	dispose() {
		super.dispose();

    this.path.geometry.dispose();
    this.path.material.dispose();
    this.path = null;
	}
}

export default CubeConnection;
