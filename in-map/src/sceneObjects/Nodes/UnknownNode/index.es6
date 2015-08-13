import Immutable from 'immutable';

import {isIdEqual} from 'in-services/util/snapshots';
import * as tracking from 'in-services/tracking';

import StickyNoteUnknownNode from '../../StickyNote/UnknownNode';
import TooltipUnknownNode from '../../Tooltips/UnknownNode';
import BaseNode from '../BaseNode/index';


export default class Unknownnode extends BaseNode {

  constructor({parent, snapshot}) {
    super({parent, snapshot});

    this.isUnknown = true;
    this.stickyNote = new StickyNoteUnknownNode(this);
  }

  onSelectedEnter() {
    super.onSelectedEnter();

    this.stickyNote.showPlus();
  }

  onSelectedLeave() {
    super.onSelectedLeave();

    this.stickyNote.hidePlus();
  }

  onSelectedHighlightEnter() {
    this.onSelectedEnter();
  }

  onSelectedHighlightLeave() {
    this.onSelectedLeave();
  }


  onSceneObjectSelected(obj) {
    super.onSceneObjectSelected(obj);
    tracking.trackEvent(tracking.events.clickOnUnMonitoredIn3dMap);
  }

  getTooltipSticky() {
    return new TooltipUnknownNode(this);
  }

  getWiredSnapshots() {
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
    const pos = this.getComponent('position').getPosition();
    return {x: pos.x - 0.5, y: pos.y + this.height, z: pos.z + 0.5};
  }

  onSnapshotUpdate() {}

  setHeight() {}

  calculatePower() {
    return 1;
  }
}
