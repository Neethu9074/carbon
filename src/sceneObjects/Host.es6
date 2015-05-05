'use strict';

import THREE from 'three';
import React from 'react';
import {getHealth} from 'instana-ui-sdk/health';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {isIdEqual} from 'instana-ui-services/util/snapshots';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';

const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);
const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);
const niceLookingDistanceForSticky = new THREE.Vector3(0, 0.8, 0.54);

//the basic geometry is a uniformed cube, where the pivot point is at the corner
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
for (let i = 0; i < cubeGeometry.vertices.length; i++) {
  cubeGeometry.vertices[i].x -= 0.5;
  cubeGeometry.vertices[i].y += 0.5;
  cubeGeometry.vertices[i].z += 0.5;
}
const cubeMaterial = new THREE.MeshBasicMaterial({visible: false});


export default class Host extends SceneObject {
  constructor({parent, snapshot}) {

    super({parent});

    this.scene = this.getScene();
    this.id = getIdString(snapshot);
    this.snapshot = snapshot;
    this.health = getHealth(snapshot);

    this.render();
    this.addStickyNote();
    this.registerEvents();
	}

	registerEvents() {
		this.addSubscription(
      this.on('endUpdate', this.update.bind(this))
    );
  }

  render() {
    //the cube needs a mesh to calculate the inside/outside viewfrustum check
    this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.cube.matrixAutoUpdate = false;

    //set this flag to add this obj to scenes octree
    this.cube.useForCollisionDetection = true;

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addStickyNote() {
    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainerStyle = this.stickyNoteContainer.style;
    this.stickyNoteContainer.classList.add('in-sticky-note');
    this.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.calcStickyNodeWorldPos();
    this.renderStickyNote();
  }

  calcStickyNodeWorldPos() {
    const worldPos = new THREE.Vector3();
    worldPos.applyMatrix4(this.cube.matrixWorld);

    worldPos.x -= stickyNoteLineEndLocalPosition.x;
    worldPos.z += niceLookingDistanceForSticky.z + 0.5;

    worldPos.y = this.cube.scale.y +
      stickyNoteLineEndLocalPosition.y;

    this.stickyNoteEndPosWorld = worldPos;
  }

  update(data) {
    //do not update if the cube is not in view frustum
    this.cube.material.visible = true;

    //if the host is near enough or is in the view frustum
    if(!data.scene.objectIsNear(this.cube) ||
      !data.scene.objectIsVisible(this.cube)) {
      //disable sticky note
      if(this.stickyNoteContainerStyle.display !== 'none') {
        this.stickyNoteContainerStyle.display = 'none';
      }
    } else {
      this.updateStickyNotePosition(data);
    }

    this.cube.material.visible = false;
  }

  updateStickyNotePosition(data) {
    const scene = data.scene;
    const pos = this.stickyNoteEndPosWorld.clone();
    pos.applyMatrix4(scene.camera.projection);

    const x = ((pos.x + 1) * scene.width / 2) | 0;
    const y = ((-pos.y + 1) * scene.height / 2) | 0;

    this.stickyNoteContainerStyle.left = x + 'px';
    this.stickyNoteContainerStyle.top = y + 'px';

    //set to '' because the display is set by zoom too. If you would set
    //this value to another like '' you would overwrite it
    this.stickyNoteContainerStyle.display = '';
  }

  setPosition(position) {
    super.setPosition(position);
    this.cube.position.copy(position);

    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  setHealth(health) {
    this.health = health;
    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  removeFromGlobalGeometry() {
    this.scene.hostFactory.removeFragment(this.id);
    this.scene.lineFactory.removeFragment(this.id);
    this.scene.zoneFactory.removeFragment(this.id);
  }

  addToGlobalGeometry() {
    //add fragment to global geometry
    this.scene.hostFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(cubePosition),
      dim: this.cube.scale,
      health: this.health
    });

    this.scene.zoneFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: this.cube.scale.clone().add(groundScale),
      health: this.health
    });

    const lineFactory = this.scene.lineFactory;
    const from = this.cube.position.clone()
      .add(new THREE.Vector3(-0.5, this.cube.scale.y, 0.5));
    const to = from.clone().add(niceLookingDistanceForSticky);
    lineFactory.addFragment({
      id: this.id,
      from, to
    });
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.setHealth(getHealth(snapshot));
    this.renderStickyNote();
  }

  renderStickyNote() {
    React.render(
      <StickyNote snapshot={this.snapshot} />,
      this.stickyNoteContainer
    );
  }

  setHeight(height) {
    this.cube.scale.y = height;

    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  dispose() {
    super.dispose();

    this.removeSceneObject(this.cube);
    this.removeFromGlobalGeometry();
    this.cube = null;

    //TODO delete sticky note

    this.scene = null;
    this.id = null;
    this.snapshot = null;
    this.health = null;
  }
}
