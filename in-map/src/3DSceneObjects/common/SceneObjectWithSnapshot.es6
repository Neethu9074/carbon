import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {highlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {getSnapshot} from 'in-stores/snapshot';

import SceneObject from './SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id, snapshotId}) {
    super({parent, id});

    snapshotId = snapshotId || id;
    this.addSubscription(getSnapshot(snapshotId).nextFrame().subscribe(snapshot => this.onSnapshotUpdate(snapshot)));

    this.addSubscription(highlightedEntityId.subscribe(highlightedId => {
      const isThisHighlighted = highlightedId === this.id ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, isThisHighlighted);
    }));
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.onSnapshotUpdated(snapshot);
  }

  dispose() {
    super.dispose();

    this.snapshot = null;
  }
}
