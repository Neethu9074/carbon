'use strict';

import THREE from 'three.js';

import DataProvider from './dataProvider';
import GroundEffect from '../sceneObjects/groundWarningEffect';
import CubeFactory from '../hostCubeFactory';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as obj from '../obj';
import * as math from '../math';
import * as states from '../cubeStates';
import CubeFace from 'instana-ui-cube-face';
import React from 'react';
import observableGenerator from 'rx-observable-generator';
import Immutable from 'immutable';

import hostImagePath from '../../../images/icon_host.png';
import systemImagePath from '../../../images/icon_system.png';
import logging from 'instalog';
import _ from 'lodash';

const logger = logging.createLogger('containerCube.es6');
let factory;


class HostDataProvider extends DataProvider {

  constructor(metaData) {
    super(metaData);
    this.setFromMetaData(metaData);

    if (factory === undefined) {
      factory = new CubeFactory();
    }
  }

  setFromMetaData(metaData) {
    const snap = metaData.get('snapshot');
    this.extractColor(snap.get('accumulated.status'));
    this.metaData = metaData;
  }

  extractColor(accumulatedStatus) {
    if (!accumulatedStatus) {
      return;
    }
    this.color = 'GREEN';
    if(accumulatedStatus.get('score') < 0.95) {
      this.color = 'YELLOW';
    }
    if(accumulatedStatus.get('score') < 0.5) {
      this.color = 'RED';
    }
  }

  get3DContent() {
    factory.createHostCube(
      this.cube.position,
      this.cube.dimension,
      this.cube.ID);

    //setup collision object
    const coll = this.getCollisionObject();
    coll.parentSceneObject = this.cube;

    //set enabled to true, if you want to click on this object
    coll.collisionEnabled = true;
    this.cube.app.addToOctree(coll);

    const invisibleObj = new THREE.Mesh();
    invisibleObj.add(coll);
    invisibleObj.position.copy(this.cube.position);
    this.collisionCube = coll;

    //setup the ground tag plane
    //const plane = this.getGroundPlane(originalDim);
    //invisibleObj.add(plane);

    return invisibleObj;
  }

  getCollisionObject() {
    const cube = new THREE.Mesh(
      obj.collisionObjectCube.geometry,
      materials.collisonHighlightMaterial);

    cube.scale.copy(this.cube.dimension);
    cube.scale.multiplyScalar(1.01); //make 1% bigger

    cube.visible = false;

    return cube;
  }

  getGroundPlane(dim) {
    const geo = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    const plane = new THREE.Mesh(geo);

    plane.position.y -= 0.25;
    plane.scale.set(dim.x, dim.z, 1);
    plane.rotation.x = -90 * math.DegToRad;

    this.cube.setStatic(plane);
    return plane;
  }

  get2DContent() {
    const dim = this.cube.dimension;
    const pos = this.cube.position;
    const div = document.createElement('div');
    div.className = 'hostCSS3DLayer';

    const object = new THREE.CSS3DObject(div);
    object.rotation.x = -90 * math.DegToRad;

    //1px in css is 1 unit in 3D space
    object.scale.set(dim.x / 450, dim.x / 450, 1);
    object.position.copy(pos);
    object.position.y += dim.y;

    this.cubeFace = <CubeFace snapshot={Immutable.fromJS(this.metaData)} />;

    const cubeSurfaceDomElement = object.element;
    React.render(
      <div>
        {this.cubeFace}
      </div>,
      cubeSurfaceDomElement
    );

    return object;
  }

  getDashboardUrl() {
    return '/#/dashboard/file/' +
      btoa(this.ID + '___com.instana.agent.' +
        'host.discovery.Host___localhost') + '.json';
  }

  setSize() {}

  setPosition() {}

  onStateChanged(newState) {
    if (this.effect !== undefined) {
      this.effect.dispose();
      this.effect = undefined;
    }

    //setup error ground effect
    const pos = this.cube.position;
    const dim = this.cube.dimension
      .clone()
      .multiplyScalar(1 / (1 - this.cube.cubeOffset)); //get the 100%

    if (newState === states.error) {
      logger.debug('state changed to: ', newState);
      this.effect = new GroundEffect(pos, dim, 'red');

    } else if (newState === states.warning) {
      logger.debug('state changed to: ', newState);
      this.effect = new GroundEffect(pos, dim, 'yellow');
    }
  }

  changeMetaData(metaData) {
    this.setFromMetaData(metaData);
  }

  dispose() {
    factory.removeFragment(this.cube.ID);
    this.cube.app.octree.remove(this.collisionCube);

    super.dispose();

    if (this.effect !== undefined) {
      this.effect.dispose();
      this.effect = null;
    }
    this.cubeFace = null;
    this.collisionCube = null;
  }
}

export default HostDataProvider;
