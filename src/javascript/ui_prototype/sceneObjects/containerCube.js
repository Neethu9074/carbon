'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import CDP from '../dataProvider/containerDataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

import Layouter from '../layouterContainer';
import {
  createLogger
}
from '../../log';

import 'lodash';


const logger = createLogger('containerCube.js');
const cubeOffset = 0.9; //90%

class ContainerCube extends SceneObject {
  constructor(app, pos, dim, dataProvider) {

    dim.multiplyScalar(cubeOffset);

    //call super contructor
    super(app, dataProvider.ID, pos, dim);

    dataProvider.setCube(this);
    this.dataProvider = dataProvider;
    this.layouter = new Layouter(1);
    this.container = [];

    this.setup3DContent();
    this.setupCollisionBox();
    this.setup2DContent();
  }

  setup3DContent() {
    const cube = this.dataProvider.get3DContent();
    this.setStatic(cube);
    this.app.scene.add(cube);
    this.cube = cube;
  }

  setupCollisionBox() {
    const cube = new THREE.Mesh(
      geometries.cubeGeometry,
      materials.collisonHighlightMaterial);

    cube.scale.copy(this.dimension);
    cube.scale.multiplyScalar(1.01); //make 1% bigger
    cube.position.copy(this.position);
    this.setStatic(cube);

    cube.parentSceneObject = this;
    this.collisionBox = cube;
  }

  setup2DContent() {
    const content2D = this.dataProvider.get2DContent();

    this.setStatic(content2D);
    this.app.scene2D.add(content2D);
    this.content2D = content2D;
  }

  addContainer(metaData) {
    const parentDim = this.dimension;

    try {
      const pos2D = this.layouter.getNext();
      this.layouter.setBlocked(pos2D, metaData.pid);
      const cubeSize = (parentDim.x / this.layouter.width);

      const pos3D = new THREE.Vector3(
        this.position.x - parentDim.x / 2 + cubeSize / 2 + pos2D.x *
        cubeSize,
        this.position.y,
        this.position.z + parentDim.z / 2 - cubeSize / 2 - pos2D.y *
        cubeSize);
      const dim = new THREE.Vector3(cubeSize, 1, cubeSize);
      const container = new ContainerCube(this.app, pos3D, dim, new CDP(
        metaData));
      this.container.push(container);

    } catch (err) {
      if (err === 'no more empty fields') {
        //increase the size of the layouter by one
        this.layouter = new Layouter(this.layouter.width + 1);

        //rescale all available container
        for (let i = 0; i < this.container.length; i++) {
          const child = this.container[i];
          const pos2D = this.layouter.getNext();
          this.layouter.setBlocked(pos2D, child.ID);

          const cubeSize = (parentDim.x / this.layouter.width);
          const pos3D = new THREE.Vector3(
            this.position.x - parentDim.x / 2 + cubeSize / 2 + pos2D.x *
            cubeSize,
            child.position.y,
            this.position.z + parentDim.z / 2 - cubeSize / 2 - pos2D.y *
            cubeSize);
          const dim = new THREE.Vector3(cubeSize, 1, cubeSize);
          child.setSize(dim);
          child.setPosition(pos3D);
        }

        //try again
        this.addContainer(metaData);
      }
    }
  }

  setSize(newSize) {
    newSize.multiplyScalar(cubeOffset);
    super.setSize(newSize);
    this.cube.scale.copy(this.dimension);

    this.collisionBox.scale.copy(this.dimension);
    this.collisionBox.scale.multiplyScalar(1.01); //make 1% bigger

    this.updateObjects();
  }

  setPosition(newPos) {
    super.setPosition(newPos);
    this.cube.position.copy(this.position);
    this.collisionBox.position.copy(this.position);

    this.updateObjects();
  }

  updateObjects() {
    this.cube.updateMatrix();
    this.collisionBox.updateMatrix();

    this.app.octree.update();
  }

  hideDetails() {
    const octree = this.app.octree;
    octree.add(this.collisionBox, { useFaces: false });

    _.forEach(this.container, child => {
      octree.remove(child.collisionBox);
    });
  }

  showDetails() {
    const octree = this.app.octree;
    octree.remove(this.collisionBox);

    _.forEach(this.container, child => {
      octree.add(child.collisionBox, { useFaces: false });
    });
  }

  setHighlight(b) {
    if(b) {
      this.app.scene.add(this.collisionBox);
    } else {
      this.app.scene.remove(this.collisionBox);
    }
  }

  dispose() {
    super.dispose();

    this.dataProvider.dispose();
    this.cube = null;
    this.collisionBox = null;
    this.content2D = null;
  }
}

export default ContainerCube;
