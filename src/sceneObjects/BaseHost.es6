'use strict';

import THREE from 'three';
import React from 'react';
import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getIdString} from 'instana-ui-services/util/snapshots';

import ConnectionGrid from '../connectionGrid';
import Connection from './Connection';
import SceneObject from './SceneObject';
import StickyNoteHost from './StickyNote/Host';

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
//global cube material to reduce object creation
const cubeMaterial = new THREE.MeshBasicMaterial();


export default class BaseHost extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.scene = parent.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.connections = [];

    this.render();
    this.stickyNote = new StickyNoteHost(this);

    this.registerEvents();
    this.show();
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;
    this.cube.rotationAutoUpdate = false;

    //set this flag to add this obj to octree and not to scene!
    this.cube.useOnlyForCollisionDetection = true;
    this.cube.parentSceneObject = this;

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addToGlobalGeometry() {}

  //adds the cube geometry
  addToHostFactory(id, pos, dim) {
    this.scene.hostFactory.addFragment({
      id, pos,
      dim: dim.clone(),
      health: this.health
    });
  }

  registerEvents() {
    this.addSubscription(eventBus.on('endUpdate').subscribe((data) =>
      this.update(data)));
  }

  update() {}

  onSnapshotUpdate() {}

  setHeight() {}

  updateStickyNotes() {
    this.stickyNote.update();
  }

  setPosition(x, y, z) {
    const pos = this.getPosition();
    if(pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    super.setPosition(x, y, z);
    this.cube.position.set(x, y, z);

    this.refreshMesh();
  }

  refreshMesh() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.stickyNote.updateWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  //connects this host with another one. the connection is stored in a
  //connections collection
  connectWith(otherHost) {
    //don't setup a new connection if it's still alive
    if(this.connections.indexOf(otherHost) >= 0) {
      return;
    }

    /*eslint-disable no-new*/
    new Connection({parent: this, from: this, to: otherHost});
    /*eslint-enable no-new*/
  }

  //is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  show() {
    super.show();
    this.enableFragments(true);
  }

  hide() {
    super.hide();
    this.enableFragments(false);
  }

  enableFragments() {}

  removeFromGlobalGeometry() {}

  clearConnections() {
    this.connections.forEach(c => c.dispose());
    this.connections = [];
  }

  //is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con === connection);
  }

  dispose() {
    this.clearConnections();

    this.removeFromGlobalGeometry();
    this.removeSceneObject(this.cube);
    this.cube = null;

    this.stickyNote.dispose();

    super.dispose();

    this.scene = null;
    this.id = null;
  }

  calculatePower() {
    return 1;
  }
}
