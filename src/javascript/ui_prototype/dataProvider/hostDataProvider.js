'use strict';

import THREE from 'three.js';

import DataProvider from './dataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as obj from '../obj';
import * as textures from '../textures';
import * as math from '../math';
import * as colors from '../colors';
import * as states from '../cubeStates';

import hostImagePath from '../../../images/icon_host.png';
import systemImagePath from '../../../images/icon_system.png';
import {
  createLogger
}
from '../../log';
import _ from 'lodash';

const logger = createLogger('containerCube.js');

const all3DMeshes = [];
let globalMesh = new THREE.Mesh(
	geometries.globalHostGeometry,
	materials.cubeHostMaterial);


class HostDataProvider extends DataProvider {
	constructor(metaData) {
		super(metaData);

		this.discription = metaData.id;
		this.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
		this.memory =
			Math.round((metaData.memory.total / 1073741824) * 100) / 100 +
			' GB RAM';
		this.OS = metaData.operatingSystem.name + ' - ' +
			metaData.operatingSystem.version;
	}

	get3DContent() {
		const geo = geometries.cubeGeometry;
		const cube = new THREE.Mesh(geo);

		cube.scale.copy(this.cube.dimension);
		cube.position.copy(this.cube.position);

		all3DMeshes.push(cube);
		this.	rebuildGlobalMesh();

    this.content3D = cube;

		const coll = this.getCollisionObject();
    coll.parentSceneObject = this.cube;

    //set enabled to true, if you want to click on this object
    coll.collisionEnabled = true;
    this.cube.app.addToOctree(coll);

		const invisibleObj = new THREE.Mesh();
		invisibleObj.add(coll);
		invisibleObj.position.copy(this.cube.position);

		return invisibleObj;
	}

	getCollisionObject() {
	  const cube = new THREE.Mesh(
      obj.collisionObjectCube.geometry,
      materials.collisonHighlightMaterial);

    cube.scale.copy(this.cube.dimension);
    cube.scale.multiplyScalar(1.1); //make 1% bigger

		cube.visible = false;

		return cube;
	}

	rebuildGlobalMesh() {
		try {
			const container = geometries.globalHostContainer;
      geometries.globalHostGeometry.dispose();
			let geo = new THREE.Geometry();

			container.remove(globalMesh);

      if(all3DMeshes.length === 0) {
        return;
      }

			_.forEach(all3DMeshes, mesh => {
        mesh.updateMatrix();
				geo.merge(mesh.geometry, mesh.matrix);
			});

      const finalGeo = new THREE.BufferGeometry().fromGeometry(geo);
      geo.dispose();

			globalMesh = new THREE.Mesh(finalGeo, materials.cubeHostMaterial);
      geometries.globalHostGeometry = finalGeo;

			container.add(globalMesh);

		} catch (err) {
			logger.error(err);
		}
	}

	get2DContent() {
		const dim = this.cube.dimension;
		const pos = this.cube.position;
		const content = this.getHTML();
		const div = document.createElement('div');
		div.className = 'hostCSS3DLayer';
		div.innerHTML = content;

		const object = new THREE.CSS3DObject(div);
		object.rotation.x = -90 * math.DegToRad;

		//1px in css is 1 unit in 3D space
		object.scale.set(dim.x / 600, dim.x / 600, 1);
		object.position.copy(pos);
		object.position.x += 1;
		object.position.z += 0;
		object.position.y += dim.y;

		return object;
	}

	getHTML() {
		const id = this.ID;
		const cpu = this.cpu;
		const memory = this.memory;
		const os = this.OS;

		const html = '<h4></h4><p><img src= bundle/' + hostImagePath +
			' class=icon>Host</p>' +
			'<ul><li>' + id + '</li></ul>' +
			'<h4></h4><p><img src= bundle/' + systemImagePath +
			' class=icon>System</p>' +
			'<ul><li>' + os + '</li>' +
			'<li>' + cpu + '</li>' +
			'<li>' + memory + '</li></ul>';

		return html;
	}

	getDashboardUrl() {
		return '/#/dashboard/file/' +
			btoa(this.ID + '___com.instana.agent.' +
      'host.discovery.Host___localhost') + '.json';
	}

	setSize() {}

	setPosition() {}

  onStateChanged(newSate) {
		console.log('state changed to: ', newSate);
	}

	dispose() {
		super.dispose();

    _.remove(all3DMeshes, mesh => mesh === this.content3D);
    this.rebuildGlobalMesh();
		//TODO
	}
}

export default HostDataProvider;
