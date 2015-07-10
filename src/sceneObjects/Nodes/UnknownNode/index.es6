'use strict';

import BaseNode from '../BaseNode/index';
import StickyNoteUnknownNode from '../../StickyNote/UnknownNode';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import Immutable from 'immutable';
import TooltipUnknownNode from '../../Tooltips/UnknownNode';


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.stickyNote = new StickyNoteUnknownNode(this);
    this.isUnknown = true;
  }

  selected() {
    super.selected();

    this.stickyNote.showPlus();
  }

  unSelected() {
    this.stickyNote.showPlus(false);

    super.unSelected();
  }

  getTooltipSticky() {
    return new TooltipUnknownNode(this);
  }

  getWiredSnapshots() {
    this.updateOnWiredSnapshots = true;
    const thisSnapShot = this.snapshot;
    const outgoing = [];
    const incoming = [];
    this.getAllMapNodes()
      .filter(node => !node.isUnknown)
      .filter(node => !isIdEqual(thisSnapShot, node.snapshot))
      .forEach((node) => {
        const wired = node.getWiredSnapshots();
        if(!wired) {
          return;
        }

        wired.get('outgoing').forEach(wiredSnapshot => {
          if(isIdEqual(thisSnapShot, wiredSnapshot)) {
            outgoing.push(node.snapshot);
          }
        });

        wired.get('incoming').forEach(wiredSnapshot => {
          if(isIdEqual(thisSnapShot, wiredSnapshot)) {
            incoming.push(node.snapshot);
          }
        });
      });

    /* eslint-disable new-cap */
    const map = Immutable.Map().asMutable();
    /* eslint-enable new-cap */
    map.set('outgoing', outgoing);
    map.set('incoming', incoming);
    return map.asImmutable();
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

  getScreenAnchorPosition() {
    const pos = this.getPosition();
    return {x: pos.x, y: pos.y + this.height, z: pos.z};
  }

  addToGlobalGeometry() {}

  removeFromGlobalGeometry() {}

  onSnapshotUpdate() {}

  setHeight() {}

  dispose() {
    this.disposeSubscriptions();

    super.dispose();
  }

  calculatePower() {
    return 1;
  }
}
