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
    this.discription = metaData.hostId;
    const snap = metaData.snapshot;

    this.OS = snap['os.name'] + '-' + snap['os.version'];
    this.steadyId = metaData.steadyId;
    this.extractMemory(snap['memory.free.status']);
    this.memoryTotal = snap['memory.total'];
    this.memoryTotal = ((this.memoryTotal / (1073741824) * 100) | 0) / 100
      + ' GB RAM';
    this.swapTotal = snap['swap.total'];
    this.metaData = metaData;
  }

  extractMemory(memoryJSON) {
    const parsed = JSON.parse(memoryJSON);
    this.color = 'GREEN';
    if(parsed.score > 0.5) {
      this.color = 'YELLOW';
    } else if(parsed.score > 0.9) {
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
    const content = this.getHTML();
    const div = document.createElement('div');
    div.className = 'hostCSS3DLayer';
    div.innerHTML = content;

    const object = new THREE.CSS3DObject(div);
    object.rotation.x = -90 * math.DegToRad;

    //1px in css is 1 unit in 3D space
    object.scale.set(dim.x / 416, dim.x / 416, 1);
    object.position.copy(pos);
    object.position.y += dim.y;

    this.cubeFace = <CubeFace
      header={this.ID}
      subHeader={this.steadyId}
      snapshot={Immutable.fromJS({})}
    />;

    const cubeSurfaceDomElement = object.element;
    React.render(
      <div>
        <span className="hostLabel">{this.ID}</span><h4></h4>
        {this.cubeFace}
      </div>,
      cubeSurfaceDomElement
    );

    return object;
  }

  switchCubeFaceState(newState) {
    this.cubeFace.props.switchState(newState);
  }

  getHTML() {
    const id = this.ID;
    const html = '<text class=hostLabel>' + id + '</text><h4></h4></br>';

    return html;
  }

/*
const cpu = this.cpu;
const memory = this.memory;
const os = this.OS;

const html = '<h4></h4><p><img src= bundle/' + hostImagePath +
' class=icon>Host</p>' +
'<ul><li>' + id + '</li></ul>' +
'<h4></h4><p><img src= bundle/' + systemImagePath +
' class=icon>System</p>' +
'<ul><li>' + os + '</li>' +
'<li>' + cpu + '</li>' +
'<li>' + memory + '</li></ul>';
*/

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

    super.dispose();

    if (this.effect !== undefined) {
      this.effect.dispose();
      this.effect = null;
    }
    this.cubeFace = null;
  }
}

export default HostDataProvider;
