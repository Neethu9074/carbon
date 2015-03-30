'use strict';

import THREE from 'three.js';

import BaseCube from './baseCube';
import ContainerCube from './containerCube';
import ContainerDataProvider from '../dataProvider/containerDataProvider';
import * as geometries from '../geometries';
import * as obj from '../obj';
import * as materials from '../materials';
import * as textures from '../textures';
import * as math from '../math';
import * as states from '../cubeStates';

import Layouter from '../layouterContainer';
import {
	createLogger
}
from '../../log';

import TWEEN from 'tween.js'
import _ from 'lodash';

const logger = createLogger('hostCube.js');
const hideCSS3DDistance = 100;
const hostWidth = 20;
const hostHeight = 4;


class HostCube extends BaseCube {

	constructor(app, pos, dataProvider) {
    //bind methods
    this.removeCSSLayerFromScene = this.removeCSSLayerFromScene.bind(this);

		this.cubeOffset = 0.15; //85%
		pos.x *= hostWidth;
		pos.z *= hostWidth;
		const dim = new THREE.Vector3(hostWidth, hostHeight, hostWidth);

		super(app, pos, dim, dataProvider);

		this.app.updates.push(this);

		this.time = 0; //stores the time since last tick
		this.tick = 1; //tick in sec
	}

	addContainerToPosWithDim(pos, dim, metaData) {
		const container = new ContainerCube(this.app, pos, dim,
			new ContainerDataProvider(metaData));

		container.parentContainer = this;

		this.children.push(container);
		this.childrenContainer.add(container.cube);

		return container;
	}

	changeMetaData(metaData) {
		this.dataProvider.changeMetaData(metaData);

		let key = 'com.instana.agent.host.sensor.Host.memory.free';
		key = 'com.instana.agent.host.sensor.Host.cpu.idle';

		const match = _.find(metaData.colors,
			item => item[key] !== undefined);

		if (match !== undefined) {
			const color = match[key];
			if (color === 'YELLOW' && this.state !== states.warning) {
				this.setState(states.warning);
			} else if (color === 'RED' && this.state !== states.error) {
				this.setState(states.error);
			} else if (color === 'GREEN' && this.state !== states.ok) {
				this.setState(states.ok);
			}
		}
	}

	onUpdate(dt) {
		this.time += dt;
		if (this.time < this.tick) {
			return;
		}
		this.time = 0;

		const distanceToFocus = this.app.controller.lookAt.position.clone()
			.sub(this.position)
			.length();

		if (distanceToFocus > hideCSS3DDistance) {
			this.hideCSS3DLayer();
			return;
		}

		const distanceToCam = this.app.mainCamera.position.clone()
			.sub(this.position)
			.length() / 2;

		if (distanceToCam > hideCSS3DDistance) {
			this.hideCSS3DLayer();
			return;
		}

		this.showCSS3DLayer();
	}

	hideCSS3DLayer() {
		if (this.hidden) {
			return;
		}

		const from = { x: 1 };
		const to = { x: 0 };
    const remove = this.removeCSSLayerFromScene;
    const content = this.content2D;

    this.tween(from, to, function() {
      content.element.style.opacity = from.x;
    }, function() {
      remove();
    });

    this.hidden = true;
	}

  removeCSSLayerFromScene() {
    //check if the css layer is still hidden after the animation time
    if(this.hidden) {
      this.app.scene.remove(this.content2D);
    }
  }

	showCSS3DLayer() {
		if (!this.hidden) {
			return;
		}

		const from = { x: 0 };
		const to = { x: 1 };
    const content = this.content2D;

    this.tween(from, to, function() {
      content.element.style.opacity = from.x;
    }, function() {});

    this.app.scene.add(this.content2D);
		this.hidden = false;
	}

  tween(from, to, onUpdate, onComplete) {
    //if tween is enabled -> stop it
    if(this.tweenAnimation !== undefined) {
      this.tweenAnimation.stop();
    }

		this.tweenAnimation = new TWEEN.Tween(from)
			.to(to, 1500)
			.easing(TWEEN.Easing.Cubic.InOut)
			.onUpdate(function() {
        onUpdate(from);
			})
			.start()
      .onComplete(function() {
        onComplete();
      });
  }

  dispose() {
		//remove this from apps update list
		_.remove(this.app.updates, obj => obj === this);
		this.time = null;
		this.tick = null;

    if(this.tweenAnimation !== undefined) {
      this.tweenAnimation.stop();
      this.tweenAnimation = null;
    }

		this.app.onHostDestroyed(this.ID);
		super.dispose();
	}
}

export default HostCube;
