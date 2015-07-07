'use strict';

import BaseNode from '../BaseNode/index';
import * as ssos from '../../../stores/selectedSceneObject';
import StickyNoteUnknownNode from '../../StickyNote/UnknownNode';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import Immutable from 'immutable';


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.stickyNote = new StickyNoteUnknownNode(this);
    this.isUnknown = true;

    //the store notifies if there was a new snapshot selected
    this.addSubscription(ssos.selectedSceneObject.subscribe((so) => {
      if(so && so.id === this.id) {
        this.select();
      } else {
        this.unSelect();
      }
    }));
  }

  selected() {
    super.selected();

    this.stickyNote.showPlus();
  }

  unSelected() {
    this.stickyNote.showPlus(false);

    super.unSelected();
  }

  setWiredStickiesActive() {}

  getWiredSnapshots() {
    this.updateOnWiredSnapshots = true;
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
    super.dispose();
  }

  calculatePower() {
    return 1;
  }
}
