'use strict';

import THREE from 'three';

import BaseNode from './BaseNode';
import StickyNoteUnknownNode from './StickyNote/UnknownNode';
import {isIdEqual} from 'instana-ui-services/util/snapshots';


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.stickyNote = new StickyNoteUnknownNode(this);

    this.isUnknown = true;
  }

  createStickyNoteHighlight() {
    return this.stickyNoteHighlight;
  }

  update() {
    super.update();

    //if the node is near enough or is in the view frustum
    if(this.isInView()) {
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
