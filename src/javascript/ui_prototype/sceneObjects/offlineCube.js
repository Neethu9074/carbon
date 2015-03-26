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

    this.uniforms = {
			time: { type: 'f', value: 1.0 },
			texture1: { type: 't', value: textures.ghostTexture2 },
			texture2: { type: 't', value: textures.ghostTexture1 }
		};

    const geo = obj.cube.geometry;
    const mat = materials.offlineMaterial;
		mat.uniforms = this.uniforms;

    const cube = new THREE.Mesh(geo, mat);

    cube.position.copy(pos);
    cube.scale.copy(dim);

    this.setStatic(cube);
    this.mesh = cube;

    logger.debug('create offline cube');
	}

	update(dt) {
		this.uniforms.time.value += 0.5 * dt;
	}
}

export default OfflineCube;
