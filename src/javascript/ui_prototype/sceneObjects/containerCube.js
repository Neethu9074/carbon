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

      if(this.hidden) {
        container.hideDetails();
        container.hide();
      } else {
        container.showDetails();
        container.show();
      }

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

  hideDetails() {
    const octree = this.app.octree;
    //add the collision box of this box
    octree.add(this.collisionBox, { useFaces: false });

    //remove all children collision boxes
    _.forEach(this.container, child => {
      child.hide();
    });

    //add this CSS3D overlay
    this.app.scene.add(this.content2D);
    this.hidden = true;
  }

  showDetails() {
    const octree = this.app.octree;
    //Remove the collision box of this box
    octree.remove(this.collisionBox);

    //add all children collision boxes
    _.forEach(this.container, child => {
        child.show();
    });

    //remove this CSS3D overlay
    this.app.scene.remove(this.content2D);
    this.hidden = false;
  }

  show() {
    this.app.octree.add(this.collisionBox, { useFaces: false });
    this.app.scene.add(this.cube);
    this.app.scene.add(this.content2D);
  }

  hide() {
    this.app.octree.remove(this.collisionBox);
    this.app.scene.remove(this.cube);
    this.app.scene.remove(this.content2D);
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

    super.dispose();

    const containerCopy = this.container.slice();
    _.forEach(containerCopy, child => {
      child.dispose();
      _.remove(this.container, container => container === child);
    });

    if(this.parentContainer !== undefined) {
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
