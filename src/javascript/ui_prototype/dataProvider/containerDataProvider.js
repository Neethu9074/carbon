'use strict';

import THREE from 'three.js';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

import DataProvider from './dataProvider';


class HostDataProvider extends DataProvider {
	constructor(metaData) {
		super(metaData);

		this.discription = metaData.discription;
		this.pid = metaData.pid;
		this.tag = metaData.tag;
		this.entityID = metaData.entityId;
		this.host = metaData.host;
	}

	get3DContent() {
		const geo = geometries.cubeGeometry;
		const mat = materials.cubeContainerMaterial;
		const cube = new THREE.Mesh(geo, mat);

		cube.scale.copy(this.cube.dimension);
		cube.position.copy(this.cube.position);

		return cube;
	}

	get2DContent() {
		const dim = this.cube.dimension;
		const pos = this.cube.position;
		const content = this.getHTML();
		const div = document.createElement('div');
		div.className = 'containerCSS3DLayer';
		div.innerHTML = content;

		const object = new THREE.CSS3DObject(div);
		object.rotation.x = -25 * math.DegToRad;

		//1px in css is 1 unit in 3D space
		object.scale.set(dim.x / 250, dim.x / 250, 1);
		object.position.copy(pos);
		object.position.z += dim.z / 2;
		object.position.y += dim.y;

		this.content2D = object;
		return object;
	}

	getHTML() {
		const disc = this.discription;
		const pid = this.pid;

		const html = '<p>' + disc + ' - ' + pid + '</p>';

		return html;
	}

	setSize(newSize) {
		const object = this.content2D;
		const dim = newSize;

		//1px in css is 1 unit in 3D space
		object.scale.set(dim.x / 250, dim.x / 250, 1);
		object.updateMatrix();
	}

	setPosition(newPos) {
		const object = this.content2D;
		const dim = this.cube.dimension;

		object.position.copy(newPos);
		object.position.z += dim.z / 2;
		object.position.y += dim.y;
		object.updateMatrix();
	}

	getDashboardUrl() {
		return '/#/dashboard/file/' +
			btoa(this.host + '___' + this.tag + '___' + this.entityID) + '.json';
	}

	dispose() {
		super.dispose();

		this.content2D = null;
	}
}

export default HostDataProvider;
