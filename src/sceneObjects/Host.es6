'use strict';

import THREE from 'three';
import React from 'react';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';

const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);


export default class Host extends SceneObject {

  constructor({parent, snapshot,
    width = 1, height = 1, depth = 1}) {

    super({parent});

    this.scene = this.getScene();
    this.id = snapshot.get('hostId');
    this.snapshot = snapshot;

    this.render(width, height, depth);
    this.addStickyNote();
    this.registerEvents();
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
    this.cube.updateMatrixWorld();
    const worldPos = new THREE.Vector3();
    worldPos.applyMatrix4(this.cube.matrixWorld);
    worldPos.add(stickyNoteLineEndLocalPosition);
    this.stickyNoteEndPosWorld = worldPos;
  }

  update(data) {
    const [x, y] = this.getStickNoteScreenPosition(
      this.stickyNoteEndPosWorld,
      data.scene.camera,
      data.scene.width,
      data.scene.height
    );

    this.stickyNoteContainer.style.top = y + 'px';
    this.stickyNoteContainer.style.left = x + 'px';
  }

  getStickNoteScreenPosition(position, camera, width, height) {
    const pos = position.clone();
    const projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse);
    pos.applyMatrix4(projScreenMat);

    return [
      ((pos.x + 1) * width / 2) | 0,
      ((-pos.y + 1) * height / 2) | 0
    ];
  }

  setPosition(position) {
    super.setPosition(position);
    this.cube.position.copy(position);
    this.cube.position.y = 0.5;

    this.calcStickyNodeWorldPos();

    this.removeFromGlobalGeometry();
    this.addToGlobalGeometry();
  }

  removeFromGlobalGeometry() {
    this.scene.hostFactory.removeFragment(this.id);
    this.scene.lineFactory.removeFragment(this.id);
  }

  addToGlobalGeometry() {
    //add fragment to global geometry
    this.scene.hostFactory.addFragment({
      id: this.id,
      pos: this.cube.position.clone().add(new THREE.Vector3(-0.5, 0, 0.5)),
      dim: this.cube.scale
    });

    const lineFactory = this.scene.lineFactory;
    const from = this.cube.position.clone()
      .add(new THREE.Vector3(-0.5, this.cube.scale.y, 0.5));
    const to = from.clone().add(new THREE.Vector3(0, 0.8, 0.54));
    lineFactory.addFragment({
      id: this.id,
      from, to
    });
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.renderStickyNote();
  }

  renderStickyNote() {
    React.render(
      <StickyNote snapshot={this.snapshot} />,
      this.stickyNoteContainer
    );
  }
}
