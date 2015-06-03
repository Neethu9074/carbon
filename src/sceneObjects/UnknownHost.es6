'use strict';

import THREE from 'three';

import BaseHost from './BaseHost';
import StickyNoteUnknownHost from './StickyNote/UnknownHost';

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);


export default class UnknownHost extends BaseHost {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.isUnknown = true;
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToHostFactory(id, pos, dim);
  }

  createStickyNote() {
    return new StickyNoteUnknownHost(this);
  }

  update(data) {
    if(!data.scene.renderHtmlStuff) {
      return;
    }

    //if the host is near enough or is in the view frustum
    if(data.scene.objectIsVisible(this.cube)) {
      this.updateStickyNotes();
    } else {
      this.stickyNote.hide();
    }
  }

  onSnapshotUpdate() {}

  setHeight() {}


  enableFragments(enabled) {
    const scene = this.scene;
    const id = this.id;
    scene.hostFactory.enableFragment(id, enabled);
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.hostFactory.removeFragment(id);
  }

  dispose() {
    super.dispose();
  }

  calculatePower() {
    return 1;
  }
}
