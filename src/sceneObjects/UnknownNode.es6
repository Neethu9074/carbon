'use strict';

import THREE from 'three';

import BaseNode from './BaseNode';
import StickyNoteUnknownNode from './StickyNote/UnknownNode';


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.isUnknown = true;
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

  addToGlobalGeometry() {}

  removeFromGlobalGeometry() {}

  onSnapshotUpdate() {}

  setHeight() {}

  dispose() {
    super.dispose();
  }

  calculatePower() {
    return 1;
  }
}
