'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import * as obj from '../obj';
import * as materials from '../materials';
import * as textures from '../textures';

import {
	createLogger
}
from '../../log';

import _ from 'lodash';

const logger = createLogger('groundWarningEffect.js');
const all3DMeshes = [];


class GroundWarningEffect extends SceneObject {

	constructor(app, pos, dim) {
		super(app, 'groundWarningEffect', pos, dim);

		const geo = obj.groundEffect.geometry;
		const ground = new THREE.Mesh(geo, materials.groundEffectMaterial);
		ground.position.copy(pos);
		ground.scale.copy(dim);

    this.setStatic(ground);

    this.ground = ground;
		all3DMeshes.push(ground);
    app.scene.add(ground);
    app.updates.push(this);
	}

  //TODO: update offset textures only once
  update() {
    textures.groundEffectTexture.offset.y = 0.25 * -this.app.timeSinceStarted;
  }

	dispose() {
    _.remove(this.app.updates, obj => obj === this);
		_.remove(all3DMeshes, obj => obj === this);
    this.app.scene.remove(this.ground);

		this.ground.geometry.dispose();
    this.ground = null;

		super.dispose();
	}
}

export default GroundWarningEffect;
