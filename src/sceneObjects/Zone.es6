'use strict';

import _ from 'lodash';
import THREE from 'three';

import SceneObject from './SceneObject';
import Host from './Host';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {getColor} from 'instana-ui-sdk/zones';

//use global geometry to reduce object instances
const zoneGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);


export default class Zone extends SceneObject {

  constructor({parent, id, zoneIndex}) {
    super({parent});

    this.id = id;
    this.zoneIndex = zoneIndex;
    this.hosts = [];

    this.renderGround();
  }

  renderGround() {
    const zoneColor = getColor(this.id);
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.10,
      color: zoneColor,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.ground = new THREE.Mesh(zoneGeometry, mat);
    // turn the ground around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    this.ground.rotation.x = -90 * Math.PI / 180;
    this.ground.renderOrder = 1;

    this.addSceneObject(this.ground);

    this.edge = new THREE.EdgesHelper(this.ground, zoneColor);
    this.edge.matrixAutoUpdate = false;
    this.addSceneObject(this.edge);
  }

  createLabel() {
    const label = this.getZoneLabel(this.id);
    label.updateMatrix();
    label.matrixAutoUpdate = false;
    this.ground.add(label);
    this.ground.label = label;
  }

  getZoneLabel(text) {
    const canvas = document.createElement('canvas');
    let zoneColor = getColor(this.id);
    zoneColor = zoneColor === undefined ? '#FFFFFF' : zoneColor;

    canvas.width = 600;
    canvas.height = 100;
    const context = canvas.getContext('2d');

    context.fillStyle = zoneColor;
    context.font = '100px "Open Sans" sans-serif';
    context.fillText(text, 0, 95);

    // use canvas contents as a texture
    const texture = new THREE.Texture(canvas);

    //set the minFilter, because the texture could not be power of 2
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const label = new THREE.Mesh(zoneGeometry, mat);

    return label;
  }

  addHost({snapshot}) {
    const hostId = getIdString(snapshot);
    let host = _.find(this.hosts, host => host.id === hostId);
    if (!host) {
      host = new Host({
        parent: this,
        snapshot
      });
      this.hosts.push(host);
    } else {
      host.onSnapshotUpdate(snapshot);
    }
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);
    this.ground.position.set(x, y, z);

    this.ground.updateMatrix();
  }

  setScale(scale) {
    this.ground.scale.copy(scale);

    if(this.ground.children.length > 0) {
      const scaleX = 1 / scale.x * 3;
      const scaleY = 1 / scale.y * 0.5;
      const scaleZ = 1 / scale.z;

      this.ground.children[0].position.set(
        -0.5 + scaleX / 2,
        -0.5 + scaleY / 2,
        0.05);
      this.ground.children[0].scale.set(
        scaleX,
        scaleY,
        scaleZ
      );

      this.ground.updateMatrix();
      this.ground.children[0].updateMatrix();
    }
  }

  removeChild(child) {
    _.remove(this.hosts, host => host.id === child.id);

    if(this.hosts.length === 0) {
      this.parent.removeChild(this);
      this.dispose();
    }
  }

  dispose() {
    this.removeSceneObject(this.ground);
    this.removeSceneObject(this.edge);

    super.dispose();

    if(this.ground.label !== undefined) {
      this.ground.label.geometry.dispose();
      this.ground.label.material.dispose();
    }

    //clear three.js cache trough disposing
    this.ground.geometry.dispose();
    this.ground.material.dispose();
    this.ground = null;

    this.id = null;
    this.hosts = [];
    this.zoneIndex = null;
  }
}
