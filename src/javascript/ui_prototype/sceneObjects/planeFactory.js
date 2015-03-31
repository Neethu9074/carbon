'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import * as geometries from '../geometries';
import * as obj from '../obj';
import * as materials from '../materials';
import * as textures from '../textures';

const globalGeometry = new THREE.Geometry();
let globalMesh = new THREE.Mesh();


class PlaneFactory extends SceneObject {

	constructor(app) {
    const pos = new THREE.Vector3();
    const dim = new THREE.Vector3();
		super(app, 'offlineCube', pos, dim);


	}

  /*
   p3  ______  p2
       |          |
       |______|
      p0        p1
  */
  createPlane(pos, dim) {
    this.app.scene.remove(globalMesh);

    const geo = globalGeometry;

    const p0 = new THREE.Vector3(
      pos.x - dim.x / 2, pos.y - dim.y / 2, 0);
    const p1 = new THREE.Vector3(
      pos.x + dim.x / 2, pos.y - dim.y / 2, 0);
    const p2 = new THREE.Vector3(
      pos.x + dim.x / 2, pos.y + dim.y / 2, 0);
    const p3 = new THREE.Vector3(
      pos.x - dim.x / 2, pos.y + dim.y / 2, 0);

    geo.vertices.push( p0 );
    geo.vertices.push( p1 );
    geo.vertices.push( p2 );
    geo.vertices.push( p3 );

    //counter-clockwise winding order
    geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geo.faces.push( new THREE.Face3( 0, 2, 3 ) );
    geo.faceVertexUvs[0][0] = [ 0, 1, 2 ]; // same order
    geo.faceVertexUvs[0][1] = [ 0, 2, 3 ];

    geo.computeFaceNormals(); //let three does the magic
    geo.computeVertexNormals();

    globalMesh.material.dispose();
    globalMesh.geometry.dispose();

    globalMesh = new THREE.Mesh(
      new THREE.BufferGeometry().fromGeometry(geo));

    this.app.scene.add(globalMesh);
  }
}

export default PlaneFactory;
