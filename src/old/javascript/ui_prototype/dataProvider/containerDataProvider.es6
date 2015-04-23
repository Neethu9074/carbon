'use strict';

import THREE from 'three';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as obj from '../obj';
import * as math from '../math';
import colors from '../colors';
import * as states from '../cubeStates';
import DataProvider from './dataProvider';

import './../../lib/helvetiker_regular.typeface.es6';


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

		const coll = this.getCollisionObject();
		coll.parentSceneObject = this.cube;

		//set enabled to true, if you want to click on this object
		coll.collisionEnabled = true;
		this.cube.app.addToOctree(coll);

		cube.add(coll);

		return cube;
	}

	getCollisionObject() {
		const cube = new THREE.Mesh(
			obj.collisionObjectCube.geometry,
			materials.collisonHighlightMaterial);

		//cube.scale.copy(this.dimension);
		cube.scale.set(1.05, 1.05, 1.05); //make 10% bigger
		cube.visible = false;

		return cube;
	}

	setSize() {}

	setPosition(newPos) {
		const dim = this.cube.dimension;
		const mesh = this.content2D;

		mesh.position.copy(newPos);
    mesh.position.x -= dim.x / 2 - 0.1;
    mesh.position.z += dim.z / 2 - 0.1;
    mesh.position.y += dim.y + 0.1;
		this.content2D.updateMatrix();
	}

	get2DContent() {
		const dim = this.cube.dimension;
		const pos = this.cube.position;
    const disc = this.discription;
    const pid = this.pid;
    const text = (disc + ' - ' + pid).substring(0, 16);


		let param = {
			size: 0.3,
			curveSegments: 1,
			font: 'helvetiker'
		};
		const shape = THREE.FontUtils.generateShapes(text, param);
		const text3d = new THREE.ShapeGeometry(shape, param);
		const geo = new THREE.BufferGeometry().fromGeometry(text3d);

		text3d.dispose();

		const textMaterial = new THREE.MeshBasicMaterial();
		const mesh = new THREE.Mesh(geo, textMaterial);

		mesh.position.copy(pos);
    mesh.position.x -= dim.x / 2 - (dim.x * 0.01); //left: 10%
    mesh.position.z += dim.z / 2 - (dim.z * 0.01); //bottom: 10%
    mesh.position.y += dim.y + 0.1;

		mesh.rotation.x = -90 * math.DegToRad;

    this.cube.setStatic(mesh);

		this.content2D = mesh;
		return mesh;
	}

	getDashboardUrl() {
		return '/#/dashboard/file/' +
			btoa(this.host + '___' + this.tag + '___' + this.entityID)
			+ '.json';
	}

	onStateChanged() {
	}

	dispose() {
		super.dispose();

		this.content2D.geometry.dispose();
		this.content2D = null;
	}
}

export default HostDataProvider;




//const labelWidth = 512;
//const labelHeight = 64;
/*
		const aspect = labelWidth / labelHeight;

		// create canvas
		var canvas = document.createElement('canvas');

		// the larger these numbers, the larger the canvas, and
		// the smoother your final image can be. If your final
		// texture is blurry or pixelated, try increasing these
		// numbers, and drawing on the canvas in a larger font.
		canvas.width = labelWidth;
		canvas.height = labelHeight;
		var context = canvas.getContext('2d');

		context.fillStyle = 'rgba(255, 255, 255, 1)';
		context.font = '40px Arial';
		context.fillText(text, 0, labelHeight / 2);

		// use canvas contents as a texture
		var texture = new THREE.Texture(canvas);

		//set the minFilter, because the texture could not be power of 2
		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({
			map: texture,
			color: colors.lightBlue,
			side: THREE.DoubleSide,
		});

		var geo = geometries.containerLabelGeometry;
		var mesh = new THREE.Mesh(geo, material);

		mesh.position.x = -0.5;
		mesh.position.z = 0.51;

		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		this.content2D = mesh;
		return mesh;
*/
