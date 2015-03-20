'use strict';

import THREE from 'three.js';

import SceneObject from './sceneObject';
import ContainerDataProvider from '../dataProvider/containerDataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as math from '../math';

import Layouter from '../layouterContainer';
import {
  createLogger
}
from '../../log';

import _ from 'lodash';


const logger = createLogger('containerCube.js');
const cubeOffset = 0.1; //90%

class ContainerCube extends SceneObject {
  constructor(app, pos, dim, dataProvider) {

    dim.multiplyScalar(1 - cubeOffset);

    //call super contructor
    super(app, dataProvider.ID, pos, dim);

    dataProvider.setCube(this);
    this.dataProvider = dataProvider;
    this.layouter = new Layouter(1, 10);

    //this is a container object for alle the children elements as
    //3D meshed (+ collision) and 2D CSS3D stuff
    //the idea is to insert all the stuff into this container
    // and when this container is hidden you only have to disable this container
    // (or add/remove from scene)
    this.childrenContainer = new THREE.Object3D();
    this.container = [];
    this.stackedContainer = [];
    app.scene.add(this.childrenContainer);

    this.setup3DContent();
    this.setupCollisionBox();
    this.setup2DContent();

    if(app.showHostDetails) {
      this.showChildren();
    } else {
      this.hideChildren();
    }
    app.octree.update();
  }

  setup3DContent() {
    const cube = this.dataProvider.get3DContent();
    this.setStatic(cube);
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

    //set enabled to true, if you want to click on this object
    cube.enabled = true;

    cube.parentSceneObject = this;
    this.collisionBox = cube;
  }

  setup2DContent() {
    const content2D = this.dataProvider.get2DContent();

    this.setStatic(content2D);
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
      const container = new ContainerCube(this.app, pos3D, dim,
        new ContainerDataProvider(metaData));

      this.container.push(container);
      container.parentContainer = this;

      this.childrenContainer.add(container.cube);
      this.childrenContainer.add(container.content2D);

      return container;

    } catch (err) {
      if (err === 'no more empty fields') {
        //increase the size of the layouter by one
        this.layouter = new Layouter(this.layouter.width + 1, 10);

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
        return this.addContainer(metaData);
      }
    }
  }

  stackContainer(metaData) {
    const pos3D = this.position.clone();
    const dim = this.dimension.clone();

    const container = new ContainerCube(this.app, pos3D, dim,
      new ContainerDataProvider(metaData));

    this.stackedContainer.push(container);
    container.parentContainer = this.parentContainer;

    return container;
  }

  setSize(newSize) {
    newSize.multiplyScalar(1 - cubeOffset);
    super.setSize(newSize);
    this.cube.scale.copy(this.dimension);

    this.collisionBox.scale.copy(this.dimension);
    this.collisionBox.scale.multiplyScalar(1.01); //make 1% bigger

    this.dataProvider.setSize(this.dimension);

    this.updateObjects();
  }

  setPosition(newPos) {
    super.setPosition(newPos);
    this.cube.position.copy(this.position);
    this.collisionBox.position.copy(this.position);

    this.dataProvider.setPosition(this.position);

    this.updateObjects();
  }

  updateObjects() {
    this.cube.updateMatrix();
    this.collisionBox.updateMatrix();

    this.app.octree.update();
  }

  hideChildren() {
    const app = this.app;
    app.scene.remove(this.childrenContainer);

    _.forEach(this.container, child => {
      app.octree.remove(child.collisionBox);
      app.scene.remove(child.content2D);
    });
  }

  showChildren() {
    const app = this.app;
    app.scene.add(this.childrenContainer);

    _.forEach(this.container, child => {
      app.octree.add(child.collisionBox, { useFaces: false });
      app.scene.add(child.content2D);
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
    logger.debug('dispose this: ', this);
    const app = this.app;
    app.scene.remove(this.cube);
    app.scene.remove(this.content2D);
    app.octree.remove(this.collisionBox);

    //destroy children
    this.app.scene.remove(this.childrenContainer);
    this.childrenContainer = null;
    _.forEach(this.container, child => {
      child.dispose();
    });
    //end destroy children

    super.dispose();

    if(this.parentContainer !== undefined) {
      this.parentContainer.childrenContainer.remove(this.cube);
      this.parentContainer.layouter.setFree(this.dataProvider.pid);
      _.remove(this.parentContainer.container, child => child === this);
    }

    this.dataProvider.dispose();
    this.layouter = null;
    this.container = null;
    this.dataProvider = null;
    this.cube = null;
    this.collisionBox = null;
    this.content2D = null;
  }
}

export default ContainerCube;
