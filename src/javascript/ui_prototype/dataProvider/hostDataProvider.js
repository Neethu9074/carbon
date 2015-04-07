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

import createLineChart from 'instana-ui-line-chart/src/chart';

import hostImagePath from '../../../images/icon_host.png';
import systemImagePath from '../../../images/icon_system.png';
import logging from 'instalog';
import _ from 'lodash';

const logger = logging.createLogger('containerCube.js');
let factory;


class HostDataProvider extends DataProvider {

	constructor(metaData) {
		super(metaData);
    this.setFromMetaData(metaData);

    if(factory === undefined) {
      factory = new CubeFactory();
    }
	}

  setFromMetaData(metaData) {
		this.discription = metaData.id;
		this.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
		this.memory =
			Math.round((metaData.memory.total / 1073741824) * 100) / 100 +
			' GB RAM';
		this.OS = metaData.operatingSystem.name + ' - ' +
			metaData.operatingSystem.version;
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
		object.scale.set(dim.x / 400, dim.x / 400, 1);
		object.position.copy(pos);
		object.position.x += 1;
		object.position.z += 0;
		object.position.y += dim.y;

    const cubeSurfaceDomElement = object.element;
    createLineChart({
      canvas: cubeSurfaceDomElement,
      height: 180
    });

		return object;
	}

	getHTML() {
		const id = this.ID;

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

  const html = '<text class=hostLabel>' + id + '</text><h4></h4></br>';

		return html;
	}

	getDashboardUrl() {
		return '/#/dashboard/file/' +
			btoa(this.ID + '___com.instana.agent.' +
      'host.discovery.Host___localhost') + '.json';
	}

	setSize() {}

	setPosition() {}

  onStateChanged(newState) {
    if(this.effect !== undefined) {
      this.effect.dispose();
      this.effect = undefined;
    }

    //setup error ground effect
    const pos = this.cube.position;
    const dim = this.cube.dimension
      .clone()
      .multiplyScalar(1 / (1 - this.cube.cubeOffset)); //get the 100%

    if(newState === states.error) {
      logger.debug('state changed to: ', newState);
      this.effect = new GroundEffect(pos, dim, 'red');

    } else if(newState === states.warning) {
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

    if(this.effect !== undefined) {
      this.effect.dispose();
      this.effect = null;
    }
	}
}

export default HostDataProvider;
