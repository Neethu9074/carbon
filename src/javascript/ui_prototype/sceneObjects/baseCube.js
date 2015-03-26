'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import OfflineCube from './offlineCube';
import ContainerDataProvider from '../dataProvider/containerDataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

import Layouter from '../layouterContainer';
import {
	createLogger
}
from '../../log';

import _ from 'lodash';

const logger = createLogger('baseCube.js');


class BaseCube extends SceneObject {
	constructor(app, pos, dim, dataProvider) {

		dim.multiplyScalar(1 - this.cubeOffset);

		//call super contructor
		super(app, dataProvider.ID, pos, dim);

		dataProvider.setCube(this);
		this.dataProvider = dataProvider;
		this.layouter = new Layouter(1, 10);

		this.setup3DContent();
		this.setup2DContent();

		//this is a container object for alle the children elements as
		//3D meshed (+ collision) and 2D CSS3D stuff
		//the idea is to insert all the stuff into this container
		//and when this container is hidden you only have to disable
    //this container (or add/remove from scene)
		this.children = [];
		this.childrenContainer = new THREE.Object3D();
		app.scene.add(this.childrenContainer);

		this.online = true;

		if (app.showHostDetails) {
			this.show();
		} else {
			this.hide();
		}
	}

	setup3DContent() {
		const cube = this.dataProvider.get3DContent();
		this.setStatic(cube);
		this.cube = cube;
	}

	setup2DContent() {
		const content2D = this.dataProvider.get2DContent();

		this.setStatic(content2D);
		this.content2D = content2D;
	}

	addContainer(metaData) {
		const parentDim = this.dimension;
		try {
			const pos2D = this.layouter.getNext();
			this.layouter.setBlocked(pos2D, metaData.pid);
			const cubeSize = (parentDim.x / this.layouter.width);

			const pos3D = new THREE.Vector3(
				this.position.x - parentDim.x / 2 + cubeSize / 2 + pos2D.x *
				cubeSize,
				this.position.y,
				this.position.z + parentDim.z / 2 - cubeSize / 2 - pos2D.y *
				cubeSize);
			const dim = new THREE.Vector3(cubeSize, 1, cubeSize);

			return this.addContainerToPosWithDim(pos3D, dim, metaData);

		} catch (err) {
			if (err === 'no more empty fields') {
				//increase the size of the layouter by one
				this.layouter = new Layouter(this.layouter.width + 1, 10);

				//rescale all available container
				for (let i = 0; i < this.children.length; i++) {
					const child = this.children[i];
					const pos2D = this.layouter.getNext();
					this.layouter.setBlocked(pos2D, child.dataProvider.pid);

					const cubeSize = (parentDim.x / this.layouter.width);
					const pos3D = new THREE.Vector3(
						this.position.x - parentDim.x / 2 + cubeSize / 2 + pos2D.x *
						cubeSize,
						child.position.y,
						this.position.z + parentDim.z / 2 - cubeSize / 2 - pos2D.y *
						cubeSize);
					const dim = new THREE.Vector3(cubeSize, 1, cubeSize);
					child.setSize(dim);
					child.setPosition(pos3D);
				}

				//try again
				return this.addContainer(metaData);
			} else {
				logger.error(err);
			}
		}
	}

	setSize(newSize) {
		newSize.multiplyScalar(1 - this.cubeOffset);
		super.setSize(newSize);

		this.cube.scale.copy(this.dimension);
		this.cube.updateMatrix();
	}

	setPosition(newPos) {
		super.setPosition(newPos);

		this.dataProvider.setPosition(this.position);

		this.cube.position.copy(this.position);
		this.cube.updateMatrix();
	}

	showChildren() {
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			child.show();
		}
	}

	hideChildren() {
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			child.hide();
		}
	}

	show() {
		this.app.scene.add(this.childrenContainer);
		this.showChildren();

		this.app.scene.add(this.content2D);
	}

	hide() {
		this.app.scene.remove(this.childrenContainer);
		this.hideChildren();

		this.app.scene.remove(this.content2D);
	}

	setOffline() {
		logger.debug('set offline');

		let offlineObject = this.getOfflineObject();
		this.app.scene.add(offlineObject.mesh);

		this.hide();
		this.online = false;
	}

	setOnline() {
		logger.debug('set online');

		let offlineObject = this.getOfflineObject();
		this.app.scene.remove(offlineObject.mesh);

		this.online = true;
		this.show();
	}

	getOfflineObject() {
		if(this.offlineObject !== undefined) {
			return this.offlineObject;
		}

		//else create the offlineObject
		let pos = this.position;
		let dim = this.dimension;
		this.offlineObject = new OfflineCube(this.app, pos, dim);

		return this.offlineObject;
	}

	//is called by app and delegates to extending classes if online
	update(dt) {
		if(this.onUpdate !== undefined && this.online) {
			this.	onUpdate(dt);
		} else {
			//if offline -> update the offline cube if available
			if(this.offlineObject !== undefined) {
				this.offlineObject.update(dt);
			}
		}
	}

	setHighlight(b) {
		if (b) {
			this.cube.children[0].visible = true;
		} else {
			this.cube.children[0].visible = false;
		}
	}

	dispose() {
		const app = this.app;
		const parentCon = this.parentContainer;

		this.disposeChildren();

		logger.debug('dispose : ', this);
		app.scene.remove(this.cube);
		app.scene.remove(this.content2D);
		app.scene.remove(this.childrenContainer);

		//if this container is a child
		if (parentCon !== undefined) {
			parentCon.layouter.setFree(this.dataProvider.pid);

			parentCon.childrenContainer.remove(this.cube);
			_.remove(parentCon.children, child => child === this);
		}

		if(this.offlineObject !== undefined) {
			this.offlineObject.dispose();
		}

		super.dispose();

		this.dataProvider.dispose();
		this.offlineObject = null;
		this.cubeOffset = null;
		this.online = null;
		this.layouter = null;
		this.parentContainer = null;
		this.container = null;
		this.dataProvider = null;
		this.cube = null;
		this.content2D = null;
	}

	disposeChildren() {
		const temp = this.children.slice(); //local copy!
		_.forEach(temp, child => {
			child.dispose();
		});
		this.app.scene.remove(this.childrenContainer);
		this.childrenContainer = null;
	}
}

export default BaseCube;
