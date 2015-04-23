'use strict';

import THREE from 'three.js';

import AbstractMeshCreationFactory from './abstractMeshCreationFactory';

//singleton
let instance;
export function getInstance() {
	if (!instance) {
    instance = new HostCubeFactory();
  }
  return instance;
}


export default class HostCubeFactory extends AbstractMeshCreationFactory {

	constructor() {
		super();
	}

	rebuild() {
		//var t1 = console.time('1');
		//this.app.scene.remove(this.globalMesh);
		this.globalGeometry.dispose();

		const frags = this.getLegalFragments();
		const cubes = frags.length;
		const ti = new Uint32Array(cubes * 30);
		const tp = new Float32Array(cubes * 24);
		const tuv = new Float32Array(cubes * 16);
		for (let i = 0; i < frags.length; i++) {
			const fragment = frags[i];
			const pos = fragment.pos;
			const dim = fragment.dim;

			const o = i * 8; //offset
			const ii = i * 30;

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

/*
			//bottom
			ti[ii + 30] = 0 + o;
			ti[ii + 31] = 1 + o;
			ti[ii + 32] = 5 + o;
			ti[ii + 33] = 0 + o;
			ti[ii + 34] = 5 + o;
			ti[ii + 35] = 4 + o;
*/

			//top
			ti[ii + 24] = 3 + o;
			ti[ii + 25] = 2 + o;
			ti[ii + 26] = 6 + o;
			ti[ii + 27] = 3 + o;
			ti[ii + 28] = 6 + o;
			ti[ii + 29] = 7 + o;


      const iuv = i * 16;
      tuv[iuv + 0] = 0; tuv[iuv + 1] = 0;
      tuv[iuv + 2] = 1; tuv[iuv + 3] = 0;
      tuv[iuv + 4] = 1; tuv[iuv + 5] = 1;
      tuv[iuv + 6] = 0; tuv[iuv + 7] = 1;

      tuv[iuv + 8] = 0; tuv[iuv + 9] = 1;
      tuv[iuv + 10] = 1; tuv[iuv + 11] = 1;
      tuv[iuv + 12] = 1; tuv[iuv + 13] = 0;
      tuv[iuv + 14] = 0; tuv[iuv + 15] = 0;


			const rx = pos.x;
			const ry = pos.y;
			const rz = pos.z;
      const dimX = dim.x / 2;
      const dimY = dim.y / 2;
      const dimZ = dim.z / 2;

			const ip = i * 24;
			tp[ip + 0] = -dimX + rx;
			tp[ip + 1] = -dimY + ry + dimY;
			tp[ip + 2] = dimZ + rz;

			tp[ip + 3] = dimX + rx;
			tp[ip + 4] = -dimY + ry + dimY;
			tp[ip + 5] = dimZ + rz;

			tp[ip + 6] = dimX + rx;
			tp[ip + 7] = dimY + ry + dimY;
			tp[ip + 8] = dimZ + rz;

			tp[ip + 9] = -dimX + rx;
			tp[ip + 10] = dimY + ry + dimY;
			tp[ip + 11] = dimZ + rz;

			tp[ip + 12] = -dimX + rx;
			tp[ip + 13] = -dimY + ry + dimY;
			tp[ip + 14] = -dimZ + rz;

			tp[ip + 15] = dimX + rx;
			tp[ip + 16] = -dimY + ry + dimY;
			tp[ip + 17] = -dimZ + rz;

			tp[ip + 18] = dimX + rx;
			tp[ip + 19] = dimY + ry + dimY;
			tp[ip + 20] = -dimZ + rz;

			tp[ip + 21] = -dimX + rx;
			tp[ip + 22] = dimY + ry + dimY;
			tp[ip + 23] = -dimZ + rz;
		}

		this.globalGeometry = new THREE.BufferGeometry();

		//add the indices
		this.globalGeometry.addAttribute('index',
			new THREE.BufferAttribute(ti, 1));

		//add all positions
		this.globalGeometry.addAttribute('position',
			new THREE.BufferAttribute(tp, 3));

		//add the uv coordinates
		this.globalGeometry.addAttribute('uv',
			new THREE.BufferAttribute(tuv, 2));
		this.globalGeometry.computeVertexNormals();

		//const material = materials.cubeHostMaterial;
		this.globalMesh = new THREE.Mesh(this.globalGeometry);

		//this.app.scene.add(this.globalMesh);
		//var t2 = console.timeEnd('1');
	}
}
