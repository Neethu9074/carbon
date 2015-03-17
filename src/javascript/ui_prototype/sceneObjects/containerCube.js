'use strict';

import THREE from 'three.js';

import sceneObject from './sceneObject';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

const cubeSize = 20;
const cubeHeight = 4;
const cubeOffset = cubeSize * 0.1;

class ContainerCube extends sceneObject{
  constructor(app, pos, dataProvider){
    const dim = new THREE.Vector3(
      cubeSize - cubeOffset,
      cubeHeight,
      cubeSize - cubeOffset);

    pos.set(pos.x * cubeSize, pos.y, pos.z * cubeSize);

    //call super contructor
		super(app, dataProvider.ID, pos, dim);

    this.dataProvider = dataProvider;

    const cube = dataProvider.get3DContent();
    cube.position.copy(pos);
    cube.scale.copy(dim);
    this.setStatic(cube);

    app.scene.add(cube);
    this.cube = cube;

    this.createCollisionBox();


    //setup2D stuff
    const content2D = dataProvider.get2DContent();

    //1px in css is 1 unit in 3D space
    content2D.scale.set(dim.x / 600, dim.x / 600, 1);
    content2D.position.copy(pos);
    content2D.position.x += 2;
    content2D.position.z += 1;
    content2D.position.y += dim.y / 2;
    content2D.updateMatrix();

    app.scene2D.add(content2D);
    this.content2D = content2D;
  }

  createCollisionBox(){
    const cube = new THREE.Mesh(
      geometries.cubeGeometry,
      materials.collisonHighlightMaterial);
    cube.position.copy(this.position);
    cube.scale.copy(this.dimension);
    cube.scale.multiplyScalar(1.01); //make 1% bigger
    this.setStatic(cube);

    this.app.octree.add(cube, {
      useFaces: false
    });
    this.app.octree.update();

    cube.parentSceneObject = this;
    this.collisionBox = cube;
  }

  dispose(){
    super.dispose();

    this.cube = null;
    this.collisionBox = null;
    this.content2D = null;
  }
}

export default ContainerCube;
