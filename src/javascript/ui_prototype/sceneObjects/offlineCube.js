'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import * as geometries from '../geometries';
import * as obj from '../obj';
import * as materials from '../materials';
import * as textures from '../textures';

import {
	createLogger
}
from '../../log';

const logger = createLogger('offlineCube.js');


class OfflineCube extends SceneObject {

	constructor(app, pos, dim) {
    dim.multiplyScalar(1.05);
		super(app, 'offlineCube', pos, dim);

    const geo = obj.cube.geometry;
    const mat = materials.offlineMaterial;
    const cube = new THREE.Mesh(geo, mat);

    cube.position.copy(pos);
    cube.scale.copy(dim);

    this.setStatic(cube);
    this.mesh = cube;

    logger.debug('create offline cube');
	}

	update() {
	}

	dispose() {
		logger.debug('dispose: ', this);
		this.app.scene.remove(this.mesh);
		this.mesh.geometry.dispose();
		this.mesh = null;
	}
}

export default OfflineCube;
