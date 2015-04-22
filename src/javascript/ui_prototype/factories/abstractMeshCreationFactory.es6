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

		//represents the geometry for all combined fragments
		this.globalGeometry = new THREE.Geometry();

		//a global mesh that stores global geometry
		this.globalMesh = new THREE.Mesh();

		//stores all added fragments to create the global geometry
		this.fragments = [];

		//bind methods
		this.update = this.update.bind(this);

		this.registerEvents();
		this.rebuildGlobalMesh = false;
	}

	registerEvents() {
    const update = this.update;
		this.subscription = this.app.emitter.on('beginUpdate').subscribe(
			//onEmit
			function() {
				update();
			},
			function() {},
			function() {}
    );
  }

	update() {
		if(this.rebuildGlobalMesh) {
			this.rebuild();
			this.rebuildGlobalMesh = false;
		}
	}

	addFragment(ID, pos, dim, enabled = true) {
		this.fragments.push({
			pos: pos,
			dim: dim,
			ID: ID, //is needed to identify the fragment when deleting
			enabled: enabled
		});

		//set rebuild to true
		//so that the mesh will be generated on the next event
		this.rebuildGlobalMesh = true;
	}

	//abstract rebuild method has to be implemented
	rebuild() {
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
