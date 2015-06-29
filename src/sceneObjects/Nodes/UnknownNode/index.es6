'use strict';

import BaseNode from '../BaseNode/index';
import StickyNoteUnknownNode from '../../StickyNote/UnknownNode';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import Immutable from 'immutable';

export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.stickyNote = new StickyNoteUnknownNode(this);

    this.isUnknown = true;
  }

  getWiredSnapshots() {
    const thisSnapShot = this.snapshot;
    const matches = [];
    this.getAllMapNodes()
      .filter(node => !node.isUnknown)
      .filter(node => !isIdEqual(thisSnapShot, node.snapshot))
      .forEach((node) => {
        const wired = node.getWiredSnapshots();
        if(!wired) {
          return;
        }

        wired.get('outgoing').concat(wired.get('incoming'))
          .forEach(wiredSnapshot => {
            if(isIdEqual(thisSnapShot, wiredSnapshot)) {
              matches.push(node.snapshot);
            }
          });
      });

    /* eslint-disable new-cap */
    const map = Immutable.Map().asMutable();
    /* eslint-enable new-cap */
    map.set('outgoing', matches);
    map.set('incoming', []);
    return map.asImmutable();
  }

  containsWired() {
    return false;
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
