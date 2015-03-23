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

    this.setup3DContent();
    this.setup2DContent();

    //this is a container object for alle the children elements as
    //3D meshed (+ collision) and 2D CSS3D stuff
    //the idea is to insert all the stuff into this container
    // and when this container is hidden you only have to disable this container
    // (or add/remove from scene)
    this.children = [];
    this.childrenContainer = new THREE.Object3D();

    this.stacked = [];
    this.stackedContainer = new THREE.Object3D();

    app.scene.add(this.childrenContainer);
    this.cube.add(this.stackedContainer);

    if(app.showHostDetails) {
      this.show();
    } else {
      this.hide();
    }
  }

  setup3DContent() {
    const cube = this.dataProvider.get3DContent();
    this.setStatic(cube);
    this.cube = cube;
  }

  setup2DContent() {
    const content2D = this.dataProvider.get2DContent();

    this.setStatic(content2D);
    this.content2D = content2D;
  }

  addContainer(metaData) {
    //if this container contains a container with the same PID stack them
    const match = _.find(this.children, child => child.dataProvider.pid === metaData.pid);
    if(match !== undefined) {
      return match.stackContainer(metaData);
    }

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

      return this.addContainerToPosWithDim(pos3D, dim, metaData);

    } catch (err) {
      if (err === 'no more empty fields') {
        //increase the size of the layouter by one
        this.layouter = new Layouter(this.layouter.width + 1, 10);

        //rescale all available container
        for (let i = 0; i < this.children.length; i++) {
          const child = this.children[i];
          const pos2D = this.layouter.getNext();
          this.layouter.setBlocked(pos2D, child.dataProvider.pid);

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

  addContainerToPosWithDim(pos, dim, metaData) {
    const container = new ContainerCube(this.app, pos, dim,
      new ContainerDataProvider(metaData));

    container.parentContainer = this;

    this.children.push(container);
    this.childrenContainer.add(container.cube);
    this.childrenContainer.add(container.content2D);

    return container;
  }

  stackContainer(metaData) {
    if(this.stacked.length > 0) {
      return this.stacked[0].stackContainer(metaData);
    }

    const dim = new THREE.Vector3(1, 1, 1);
    dim.multiplyScalar(1 + cubeOffset);

    const pos3D = new THREE.Vector3(0, this.dimension.y, 0);
    const container = new ContainerCube(this.app, pos3D, dim,
      new ContainerDataProvider(metaData));

    container.parentStacked = this;

    this.stacked.push(container);
    this.stackedContainer.add(container.cube);
    this.stackedContainer.add(container.content2D);

    return container;
  }

  setSize(newSize) {
    newSize.multiplyScalar(1 - cubeOffset);
    super.setSize(newSize);
    this.cube.scale.copy(this.dimension);

    this.dataProvider.setSize(this.dimension);

    this.cube.updateMatrix();
  }

  setPosition(newPos) {
    super.setPosition(newPos);
    this.cube.position.copy(this.position);

    this.dataProvider.setPosition(this.position);

    this.cube.updateMatrix();
  }

  showChildren() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.show();
      this.app.scene.remove(child.content2D);
      this.childrenContainer.add(child.content2D);
    }
  }

  hideChildren() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      child.hide();
      this.app.scene.remove(child.content2D);
      this.childrenContainer.remove(child.content2D);
    }
  }

  showStacked(){
    _.forEach(this.stacked, child => {
      child.show();
      this.app.scene.remove(child.content2D);
      this.stackedContainer.add(child.content2D);
    });
  }

  hideStacked(){
    _.forEach(this.stacked, child => {
      child.hide();
      this.app.scene.remove(child.content2D);
      this.stackedContainer.remove(child.content2D);
    });
  }

  show() {
    this.app.scene.add(this.childrenContainer);
    this.showStacked();
    this.showChildren();

    this.app.scene.add(this.content2D);
  }

  hide() {
    this.app.scene.remove(this.childrenContainer);
    this.hideStacked();
    this.hideChildren();

    this.app.scene.remove(this.content2D);
  }

  setHighlight(b) {
    if(b) {
      this.cube.children[0].visible = true;
    } else {
      this.cube.children[0].visible = false;
    }
  }

  getWorldPos() {
    if(this.parentStacked !== undefined) {
      return this.parentStacked.getWorldPos();
    }
    return this.position;
  }

  dispose() {
    const app = this.app;
    const parentCon = this.parentContainer;
    const parentStacked = this.parentStacked;

    this.disposeChildren();
    this.disposeStacked();

    logger.debug('dispose : ', this);
    app.scene.remove(this.cube);
    app.scene.remove(this.content2D);

    //if this container is a child
    if(parentCon !== undefined) {
      parentCon.layouter.setFree(this.dataProvider.pid);

      parentCon.childrenContainer.remove(this.cube);
      _.remove(parentCon.children, child => child === this);
    }

    //if this container is stacked on another one
    if(parentStacked !== undefined) {

      parentStacked.stackedContainer.remove(this.cube);
      _.remove(parentStacked.stacked, child => child === this);
    }

    super.dispose();

    this.dataProvider.dispose();
    this.layouter = null;
    this.parentContainer = null;
    this.container = null;
    this.dataProvider = null;
    this.cube = null;
    this.content2D = null;
  }

  disposeChildren() {
    const temp = this.children.slice(); //local copy!
    _.forEach(temp, child => {
      child.dispose();
    });
    this.app.scene.remove(this.childrenContainer);
    this.childrenContainer = null;
  }

  disposeStacked() {
    const temp = this.stacked.slice(); //local copy!
    _.forEach(temp, stacked => {
      stacked.dispose();
    });
    this.app.scene.remove(this.stackedContainer);
    this.stackedContainer = null;
  }
}

export default ContainerCube;
