'use strict';

import THREE from 'three.js';

import DataProvider from './dataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as textures from '../textures';
import * as math from '../math';
import * as colors from '../colors';

import hostImagePath from '../../../images/icon_host.png';
import systemImagePath from '../../../images/icon_system.png';

import _ from 'lodash';


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
		const mat = materials.cubeHostMaterial;
		const cube = new THREE.Mesh(geo, mat);

		cube.scale.copy(this.cube.dimension);
		cube.position.copy(this.cube.position);

		all3DMeshes.push(cube);
		this.rebuildGlobalMesh();

    this.content3D = cube;
		return new THREE.Mesh();
	}

	rebuildGlobalMesh() {
		try {
			const container = geometries.globalHostContainer;
      geometries.globalHostGeometry.dispose();
			let geo = new THREE.Geometry();

			container.remove(globalMesh);

			_.forEach(all3DMeshes, mesh => {
        mesh.updateMatrix();
				//const temp = new THREE.BufferGeometry().fromGeometry(mesh.geometry);
				geo.merge(mesh.geometry, mesh.matrix);
			});

			globalMesh = new THREE.Mesh(geo, materials.cubeHostMaterial);
      geometries.globalHostGeometry = geo;
			container.add(globalMesh);

		} catch (er) {
			console.log(er);
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
		object.position.x += 2;
		object.position.z += 1;
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
			btoa(this.ID + '___com.instana.agent.host.discovery.Host___localhost') +
			'.json';
	}

	dispose() {
		super.dispose();

    _.remove(all3DMeshes, mesh => mesh === this.content3D);
    this.rebuildGlobalMesh();
		//TODO
	}
}

export default HostDataProvider;
