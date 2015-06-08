'use strict';

import THREE from 'three';

import BaseNode from './BaseNode';
import StickyNoteUnknownNode from './StickyNote/UnknownNode';

const cubePosition = new THREE.Vector3(-0.5, 0, 0.5);


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.isUnknown = true;
  }

  addToGlobalGeometry() {
    const id = this.id;
    const pos = this.cube.position.clone().add(cubePosition);
    const dim = this.cube.scale;

    this.addToNodeFactory(id, pos, dim);
  }

  createStickyNote() {
    return new StickyNoteUnknownNode(this);
  }

  update(data) {
    if(!data.scene.renderHtmlStuff) {
      return;
    }

    //if the node is near enough or is in the view frustum
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
    scene.nodeFactory.enableFragment(id, enabled);
  }

  removeFromGlobalGeometry() {
    const id = this.id;
    const scene = this.scene;
    scene.nodeFactory.removeFragment(id);
  }

  dispose() {
    super.dispose();
  }

  calculatePower() {
    return 1;
  }
}
