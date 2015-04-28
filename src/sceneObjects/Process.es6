'use strict';

import THREE from 'three';
import React from 'react';

import SceneObject from './SceneObject';
import colors from '../colors';
import StickyNote from './StickyNote';

const stickyNoteLineEndLocalPosition = new THREE.Vector3(0.5, 0.8, 0);


export default class Process extends SceneObject {

  constructor({parent, snapshot}) {
    super({parent});

    this.id = Math.random();
    this.snapshot = snapshot;

    this.render();
    this.addStickyNote();
	}

  render() {
    this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 1, 1, 1));
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
