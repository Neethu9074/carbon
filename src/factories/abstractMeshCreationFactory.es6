'use strict';

import THREE from 'three.js';
import * as EventEmitter from '../eventEmitter';
import _ from 'lodash';


export default class AbstractMeshCreationFactory {

	constructor() {
		this.update = this.update.bind(this);

		//represents the geometry for all combined fragments
		this.globalGeometry = new THREE.Geometry();

		//a global mesh that stores global geometry
		this.globalMesh = new THREE.Mesh();

		//stores all added fragments to create the global geometry
		this.fragments = [];

		this.rebuildGlobalMesh = false;
		this.registerEvents();
	}

	registerEvents() {
    const update = this.update;
		const emitter = EventEmitter.getInstance();
		this.subscription = emitter.on('endUpdate').subscribe(
			//onEmit
			function(data) {
				update(data);
			},
			function() {},
			function() {}
    );
  }

	update(data) {
		if(this.rebuildGlobalMesh) {
			data.scene.scene.remove(this.globalMesh);

			this.rebuild();
			this.rebuildGlobalMesh = false;

			data.scene.scene.add(this.globalMesh);
		}
	}

	addFragment({ID, pos, dim, enabled = true}) {
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

	removeFragment(ID) {
		_.remove(this.fragments, fragment => fragment.id === ID);

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
