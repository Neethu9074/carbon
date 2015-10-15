import Immutable from 'immutable';

import * as tracking from 'in-services/tracking';

import StickyNoteUnknownNode from '../../StickyNote/UnknownNode';
import TooltipUnknownNode from '../../Tooltips/UnknownNode';
import BaseNode from '../BaseNode';


export default class Unknownnode extends BaseNode {

  constructor({parent, coordinates, id}) {
    super({parent, id});

    this.isUnknown = true;
    this.snapshot = coordinates;
    this.stickyNote = new StickyNoteUnknownNode(this);
    this.tooltip = new TooltipUnknownNode(this);
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

    if (obj && obj.id === this.id) {
      tracking.events.clickOnUnMonitoredIn3dMap();
    }
  }

  getWiredSnapshots() {
    const id = this.id;
    const outgoing = [];
    const incoming = [];
    this.getAllMapNodes().forEach(node => {
      //filter all unknown nodes and this
      if(node.isUnknown || id === node.id) {
        return;
      }

      const wired = node.getWiredSnapshots();
      if(!wired) {
        return;
      }

      wired.get('outgoing').forEach(wiredSnapshot => {
        if(id === wiredSnapshot.get('id')) {
          incoming.push(node.snapshot);
        }
      });

      wired.get('incoming').forEach(wiredSnapshot => {
        if(id === wiredSnapshot.get('id')) {
          outgoing.push(node.snapshot);
        }
      });
    });

    const map = Immutable.Map().asMutable();
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

  calculatePower() {
    return 1;
  }
}
