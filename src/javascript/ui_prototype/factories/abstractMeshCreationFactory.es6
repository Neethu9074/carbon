'use strict';

import THREE from 'three.js';

import * as geometries from '../geometries';
import * as materials from '../materials';
import * as obj from '../obj';
import * as app from '../app';

import _ from 'lodash';


class AbstractMeshCreationFactory {

	constructor() {
		this.app = app.getApplication();
		this.globalGeometry = new THREE.Geometry();
		this.globalMesh = new THREE.Mesh();
		this.fragments = [];
		this.registered = false;
		this.rebuildGlobalMesh = false;

		//bind methods
		this.update = this.update.bind(this);

		if(!this.registered) {
			this.registerEvents();
			this.registered = true;
		}
	}

	registerEvents() {
    const update = this.update;
		this.subscription = this.app.emitter.on('beginUpdate').subscribe(
			function() {
				update();
			},
			function() {},
			function() {}
    );
  }

	update() {
		if(this.rebuildGlobalMesh) {
			this.rebuildGlobalMesh = false;
			this.rebuild();
		}
	}

	//abstract rebuild method has to be implemented
	rebuild() {
		throw 'NOT IMPLEMENTED EXCEPTION';
	}

	//abstract addFragment method has to be implemented
	addFragment() {
		throw 'NOT IMPLEMENTED EXCEPTION';
	}

	//returns all registered objects which are enabled
	getLegalFragments() {
		return this.fragments.filter(item => item.enabled);
	}

	disableFragment(ID) {
		this.fragments.find(item => item.ID === ID).enabled = false;

		//set rebuild to true
		//so that the mesh will be generated on the next event
		this.rebuildGlobalMesh = true;
	}

	enableFragment(ID) {
		this.fragments.find(item => item.ID === ID).enabled = true;

		//set rebuild to true
		//so that the mesh will be generated on the next event
		this.rebuildGlobalMesh = true;
	}
}

export default AbstractMeshCreationFactory;
