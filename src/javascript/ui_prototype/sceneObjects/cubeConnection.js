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
	constructor(a, b) {

		//call super constructor
		super('ground', a.position, a.dimension);

		logger.info('connect', a.ID, 'with', b.ID);
		this.path = this.createPath([a.position, b.position]);
    this.app.scene.add(this.path);
	}

	createPath(points) {
		//you need at least two points to create a line
		if (points.length < 2) {
			return undefined;
		}

    const path = this.app.pathFinder.getPath( points[0], points[1] );
    const geo = new THREE.BufferGeometry();
    const geoPos = new Float32Array(path.length * 3);

    let index = 0;
    for (let i = 0; i < path.length; i++) {
      const position = path[i];

      geoPos[index] = position[0] - 190;
      geoPos[index + 1] = 0.5;
      geoPos[index + 2] = position[1] - 190;

      index += 3;
    }
    geo.addAttribute('position', new THREE.BufferAttribute(geoPos, 3));
		const line = new THREE.Line(geo);

		return line;


/*
		const geometry = new THREE.BufferGeometry();
		const material = new THREE.LineBasicMaterial({
			vertexColors: THREE.VertexColors
		});

    const itemsPerPoint = 3; //x y z
    const numLines = points.length * itemsPerPoint;
		const positions = new Float32Array(numLines);
		const colors = new Float32Array(numLines);
		for (let i = 0; i < points.length; i++) {
			const x = points[i].x;
			const y = points[i].y;
			const z = points[i].z;

			// positions
			positions[i * itemsPerPoint] = x;
			positions[i * itemsPerPoint + 1] = y;
			positions[i * itemsPerPoint + 2] = z;

			// colors
			colors[i * itemsPerPoint] = (x / 10) + 0.5;
			colors[i * itemsPerPoint + 1] = (y / 10) + 0.5;
			colors[i * itemsPerPoint + 2] = (z / 10) + 0.5;
		}

		geometry.addAttribute('position',
      new THREE.BufferAttribute(positions, itemsPerPoint));

    geometry.addAttribute('color',
      new THREE.BufferAttribute(colors, itemsPerPoint));

		const line = new THREE.Line(geometry, material);
		return line;
		*/
	}

	dispose() {
		super.dispose();

    this.path.geometry.dispose();
    this.path.material.dispose();
    this.path = null;
	}
}

export default CubeConnection;
