'use strict';

import THREE from 'three.js';

import dataProvider from './dataProvider';
import * as geometries from '../geometries';
import * as materials from '../materials';
import * as textures from '../textures';
import * as math from '../math';
import * as colors from '../colors';

import hostImagePath from '../../../images/icon_host.png';
import systemImagePath from '../../../images/icon_system.png';

import '../../lib/CSS3DRenderer';


class HostDataProvider extends dataProvider {
  constructor(metaData) {
    super(metaData);

    this.discription = metaData.id;
    this.cpu = metaData.cpu.count + 'x ' + metaData.cpu.model;
    this.memory =
      Math.round((metaData.memory.total / 1073741824) * 100) / 100 +
      ' GB RAM';
    this.OS = metaData.operatingSystem.name + ' - ' +
      metaData.operatingSystem.version;
  }

  get3DContent() {
    const geo = geometries.cubeGeometry;
    const mat = materials.cubeHostMaterial;

    return new THREE.Mesh(geo, mat);
  }

  get2DContent() {
    const content = this.getHTML();
    const div = document.createElement('div');
    div.className = 'hostCSS3DLayer';
    div.innerHTML = content;

    const object = new THREE.CSS3DObject(div);
    object.rotation.x = -90 * math.DegToRad;
    //set static
    object.matrixAutoUpdate = false;
    object.updateMatrix();

    return object;
  }

  getHTML() {
    const id = this.ID;
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

    return html;
  }
}

export default HostDataProvider;
