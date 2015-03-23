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
      geometries.cubeGeometry,
      materials.collisonHighlightMaterial);

    //cube.scale.copy(this.dimension);
    cube.scale.set(1.01, 1.01, 1.01); //make 1% bigger
    cube.visible = false;

    return cube;
  }

  get2DContent() {
		/*
		try {
			  // create canvas
		    var canvas = document.createElement('canvas');

		    // the larger these numbers, the larger the canvas, and
		    // the smoother your final image can be. If your final
		    // texture is blurry or pixelated, try increasing these
		    // numbers, and drawing on the canvas in a larger font.
		    canvas.width = 512;
		    canvas.height = 64;

		    // draw the score of "50" to the canvas
		    var context = canvas.getContext('2d');
		    context.font = "Bold 32px Helvetica";
		    context.fillStyle = "rgba(255,0,0,0.95)";
		    context.fillText('0', 0, 300);

		    // use canvas contents as a texture
		    var texture = new THREE.Texture(canvas)
		    texture.needsUpdate = true;

		    var material = new THREE.MeshBasicMaterial({
		      map: texture,
		      side: THREE.DoubleSide
		    });

		    var geo = new THREE.PlaneGeometry(this.cube.dimension.x, 1, 1, 1);

		    var mesh = new THREE.Mesh(geo, material);
		    this.content2D = mesh;
		    return mesh;

		} catch (err) {
			console.log(err)
		}
*/


    const dim = this.cube.dimension;
    const pos = this.cube.position;
    const content = this.getHTML();
    const div = document.createElement('div');
    div.className = 'containerCSS3DLayer';
    div.innerHTML = content;

    const object = new THREE.CSS3DObject(div);
    object.rotation.x = -90 * math.DegToRad;

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
