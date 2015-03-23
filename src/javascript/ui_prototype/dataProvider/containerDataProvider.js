'use strict';

import THREE from 'three.js';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';
import * as colors from '../colors';

import DataProvider from './dataProvider';

const labelWidth = 512;
const labelHeight = 64;


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

    const content2D = this.getLabel();
    cube.add(content2D);

    return cube;
  }

  getCollisionObject() {
    const cube = new THREE.Mesh(
      geometries.cubeGeometry,
      materials.collisonHighlightMaterial);

    //cube.scale.copy(this.dimension);
    cube.scale.set(1.05, 1.05, 1.05); //make 10% bigger
    cube.visible = false;

    return cube;
  }

  getLabel() {
    const dim = this.cube.dimension;
    const pos = this.cube.position;
    const aspect = labelWidth / labelHeight;

    const disc = this.discription;
    const pid = this.pid;

    const content = disc + ' - ' + pid;

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
    context.fillText(content, 0, labelHeight / 2);

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
  }

  get2DContent() {
    return new THREE.Object3D();

    /*
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
		*/
  }

  getHTML() {
    const disc = this.discription;
    const pid = this.pid;

    const html = '<p>' + disc + ' - ' + pid + '</p>';

    return html;
  }

  getDashboardUrl() {
    return '/#/dashboard/file/' +
      btoa(this.host + '___' + this.tag + '___' + this.entityID) + '.json';
  }

  dispose() {
    super.dispose();

    this.content2D.material.map.dispose();
    this.content2D.material.dispose();
    this.content2D.geometry.dispose();
    this.content2D = null;
  }
}

export default HostDataProvider;
