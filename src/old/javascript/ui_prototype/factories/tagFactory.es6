'use strict';

import THREE from 'three';

import * as geometries from '../geometries';
import * as materials from '../materials';

import AbstractMeshCreationFactory from './abstractMeshCreationFactory';

//singleton
let instance;
export function getInstance() {
	if (!instance) {
    instance = new TagFactory();
  }
  return instance;
}


class TagFactory extends AbstractMeshCreationFactory {

	constructor() {
		super();
	}

	addFragment(ID, pos, dim, enabled = true) {
		const numOtherFragmentsWithSameId = this.fragments
			.filter(fragment => fragment.ID === ID).length;

		//translate the tag to stack them
		pos = pos.clone()
			.add(new THREE.Vector3(0, numOtherFragmentsWithSameId, 0));

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

	rebuild() {
		this.app.scene.remove(this.globalMesh);
		this.globalGeometry.dispose();

		const frags = this.getLegalFragments();
		const tags = frags.length;
		const ti = new Uint32Array(tags * 24);
		const tp = new Float32Array(tags * 24);
		const tc = new Float32Array(tags * 24);
		const color = new THREE.Color();
		for (let i = 0; i < frags.length; i++) {
			//indices
			const fragment = frags[i];
			const pos = fragment.pos;
			const dim = fragment.dim;

			const o = i * 8; //offset
			const ii = i * 24;

			//front
			ti[ii + 0] = 0 + o;
			ti[ii + 1] = 1 + o;
			ti[ii + 2] = 2 + o;
			ti[ii + 3] = 0 + o;
			ti[ii + 4] = 2 + o;
			ti[ii + 5] = 3 + o;

			//back
			ti[ii + 6] = 4 + o;
			ti[ii + 7] = 5 + o;
			ti[ii + 8] = 6 + o;
			ti[ii + 9] = 4 + o;
			ti[ii + 10] = 6 + o;
			ti[ii + 11] = 7 + o;

			//left
			ti[ii + 12] = 4 + o;
			ti[ii + 13] = 0 + o;
			ti[ii + 14] = 3 + o;
			ti[ii + 15] = 4 + o;
			ti[ii + 16] = 3 + o;
			ti[ii + 17] = 7 + o;

			//right
			ti[ii + 18] = 1 + o;
			ti[ii + 19] = 5 + o;
			ti[ii + 20] = 6 + o;
			ti[ii + 21] = 1 + o;
			ti[ii + 22] = 6 + o;
			ti[ii + 23] = 2 + o;


			//positions
			const rx = pos.x;
			const ry = pos.y;
			const rz = pos.z;
      const dimX = dim.x / 2;
      const dimY = 0.5;
      const dimZ = dim.z / 2;

			tp[ii + 0] = -dimX + rx;
			tp[ii + 1] = -dimY + ry + dimY;
			tp[ii + 2] = dimZ + rz;

			tp[ii + 3] = dimX + rx;
			tp[ii + 4] = -dimY + ry + dimY;
			tp[ii + 5] = dimZ + rz;

			tp[ii + 6] = dimX + rx;
			tp[ii + 7] = dimY + ry + dimY;
			tp[ii + 8] = dimZ + rz;

			tp[ii + 9] = -dimX + rx;
			tp[ii + 10] = dimY + ry + dimY;
			tp[ii + 11] = dimZ + rz;

			tp[ii + 12] = -dimX + rx;
			tp[ii + 13] = -dimY + ry + dimY;
			tp[ii + 14] = -dimZ + rz;

			tp[ii + 15] = dimX + rx;
			tp[ii + 16] = -dimY + ry + dimY;
			tp[ii + 17] = -dimZ + rz;

			tp[ii + 18] = dimX + rx;
			tp[ii + 19] = dimY + ry + dimY;
			tp[ii + 20] = -dimZ + rz;

			tp[ii + 21] = -dimX + rx;
			tp[ii + 22] = dimY + ry + dimY;
			tp[ii + 23] = -dimZ + rz;


			//colors
			const vx = Math.random();
			const vy = Math.random();
			const vz = Math.random();

			color.setRGB( vx, vy, vz );

			tc[ii + 0] = color.r;
			tc[ii + 1] = color.g;
			tc[ii + 2] = color.b;

			tc[ii + 3] = color.r;
			tc[ii + 4] = color.g;
			tc[ii + 5] = color.b;

			tc[ii + 6] = color.r;
			tc[ii + 7] = color.g;
			tc[ii + 8] = color.b;

			tc[ii + 9] = color.r;
			tc[ii + 10] = color.g;
			tc[ii + 11] = color.b;

			tc[ii + 12] = color.r;
			tc[ii + 13] = color.g;
			tc[ii + 14] = color.b;

			tc[ii + 15] = color.r;
			tc[ii + 16] = color.g;
			tc[ii + 17] = color.b;

			tc[ii + 18] = color.r;
			tc[ii + 19] = color.g;
			tc[ii + 20] = color.b;

			tc[ii + 21] = color.r;
			tc[ii + 22] = color.g;
			tc[ii + 23] = color.b;
		}

		this.globalGeometry = new THREE.BufferGeometry();

		//add the indices
		this.globalGeometry.addAttribute('index',
			new THREE.BufferAttribute(ti, 1));

		//add all positions
		this.globalGeometry.addAttribute('position',
			new THREE.BufferAttribute(tp, 3));

		this.globalGeometry.addAttribute( 'color',
			new THREE.BufferAttribute(tc, 3));

		this.globalGeometry.computeVertexNormals();

		const material = new THREE.MeshBasicMaterial( {
			side: THREE.DoubleSide,
			vertexColors: THREE.VertexColors
		});

		this.globalMesh = new THREE.Mesh(this.globalGeometry, material);

		this.app.scene.add(this.globalMesh);
	}
}

export default TagFactory;
