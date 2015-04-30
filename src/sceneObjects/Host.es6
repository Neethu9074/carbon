'use strict';

import THREE from 'three';
import React from 'react';
import {getHealth} from 'instana-ui-sdk/health';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';

const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);
const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundPosition = new THREE.Vector3(-0.5, 0, 0.5);
const groundScale = new THREE.Vector3(0.67, 0, 0.67);
const niceLookingDistanceForSticky = new THREE.Vector3(0, 0.8, 0.54);


export default class Host extends SceneObject {

  constructor({parent, snapshot,
    width = 1, height = 1, depth = 1}) {

    super({parent});

    this.scene = this.getScene();
    this.id = snapshot.get('hostId');
    this.snapshot = snapshot;
    this.health = getHealth(snapshot);

    this.render(width, height, depth);
    this.addStickyNote();
    this.registerEvents();

    this.setLineVisible(true);
	}

	registerEvents() {
		this.addSubscription(
      this.on('endUpdate').subscribe(this.update.bind(this))
    );
  }

  render(width, height, depth) {
    this.cube = new THREE.Object3D();
    this.cube.scale.set(width, height, depth);

    const collisionBox = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth));
    collisionBox.material.visible = false;

    this.cube.collisionObject = collisionBox;
    this.cube.add(collisionBox);

    this.addSceneObject(this.cube);
    this.addToGlobalGeometry();
  }

  addStickyNote() {
    this.stickyNoteContainer = document.createElement('div');
    this.stickyNoteContainer.classList.add('in-sticky-note');
    this.getHtmlContainer().appendChild(this.stickyNoteContainer);

    this.calcStickyNodeWorldPos();
    this.renderStickyNote();
  }

  calcStickyNodeWorldPos() {
    this.cube.updateMatrix();
    this.cube.updateMatrixWorld();

    const worldPos = new THREE.Vector3();
    worldPos.applyMatrix4(this.cube.matrixWorld);

    worldPos.x -= stickyNoteLineEndLocalPosition.x;
    worldPos.z += niceLookingDistanceForSticky.z + 0.5;

    worldPos.y = this.cube.scale.y +
      stickyNoteLineEndLocalPosition.y;

    this.stickyNoteEndPosWorld = worldPos;
  }

  update(data) {
    const pos = this.getStickNoteScreenPosition({
      position: this.stickyNoteEndPosWorld,
      camera: data.scene.camera,
      width: data.scene.width,
      height: data.scene.height
    });

    this.stickyNoteContainer.style.left = pos.x + 'px';
    this.stickyNoteContainer.style.top = pos.y + 'px';
  }

  getStickNoteScreenPosition({position, camera, width, height}) {
    const pos = position.clone();
    pos.applyMatrix4(camera.projection);

    return {
      x: ((pos.x + 1) * width / 2) | 0,
      y: ((-pos.y + 1) * height / 2) | 0
    };
  }

  setPosition(position) {
    super.setPosition(position);
    this.cube.position.copy(position);

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
    this.scene.groundFactory.removeFragment(this.id);
  }

  addToGlobalGeometry() {
    //add fragment to global geometry
    this.scene.hostFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(cubePosition),
      dim: this.cube.scale,
      health: this.health
    });

    this.scene.groundFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(groundPosition),
      dim: this.cube.scale.clone().add(groundScale),
      health: this.health
    });

    if(this.lineVisible) {
      const lineFactory = this.scene.lineFactory;
      const from = this.cube.position.clone()
        .add(new THREE.Vector3(-0.5, this.cube.scale.y, 0.5));
      const to = from.clone().add(niceLookingDistanceForSticky);
      lineFactory.addFragment({
        id: this.id,
        from, to
      });
    }
  }

  setLineVisible(lineVisible) {
    this.lineVisible = lineVisible;
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

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }
}
