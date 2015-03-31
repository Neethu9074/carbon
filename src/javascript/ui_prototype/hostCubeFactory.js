'use strict';

import THREE from 'three.js';

import * as geometries from './geometries';
import * as materials from './materials';
import * as obj from './obj';
import * as math from './math';
import * as colors from './colors';
import * as app from './app';

let globalGeometry = new THREE.Geometry();
let globalMesh = new THREE.Mesh();
const fragments = [];


class HostCubeFactory {

  constructor() {
    this.app = app.getApplication();
  }

  createHostCube(pos, dim, ID) {
    const geo = geometries.cubeGeometry;
    let cube = new THREE.Mesh(geo);

    cube.scale.copy(dim);
    cube.position.copy(pos);
    cube.updateMatrix();

    fragments.push({
      geometry: geo,
      matrix: cube.matrix,
      ID: ID //is needed to identify the fragment when deleting
    });

    this.rebuild();

    //return empty objecs as a container for further use
    return new THREE.Object3D();
  }

  rebuild() {
    this.app.scene.remove(globalMesh);

    globalGeometry.dispose();
    const temp = new THREE.Geometry();

    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];
      temp.merge(fragment.geometry, fragment.matrix);
    }

    globalGeometry = new THREE.BufferGeometry().fromGeometry(temp);
    globalMesh = new THREE.Mesh(
			globalGeometry,
			materials.cubeHostMaterial
		);

    //clear temp geometry from three cache
    temp.dispose();

    this.app.scene.add(globalMesh);
  }
}

export default HostCubeFactory;
