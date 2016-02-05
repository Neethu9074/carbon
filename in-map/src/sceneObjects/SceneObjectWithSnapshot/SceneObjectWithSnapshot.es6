import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import {getHealthStatus} from 'in-stores/healthStatus';
import {getSnapshot} from 'in-stores/snapshot';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObject from '../SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.addSubscription(getSnapshot(this.id).nextFrame().subscribe(snapshot => this.onSnapshotUpdate(snapshot)));

    this.addSubscription(highlightedSnapshot.highlightedEntityId.subscribe(highlightedId => {
      const isThisHighlighted = highlightedId === this.id ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, isThisHighlighted);
    }));

    this.addSubscription(getHealthStatus(this.id).subscribe(healthStatus => this.onHealthStatusUpdate(healthStatus)));
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.onSnapshotUpdated(snapshot);
  }

  onHealthStatusUpdate(healthStatus) {
    this.healthStatus = healthStatus;
    console.log(healthStatus);
  }

  dispose() {
    super.dispose();

    this.snapshot = null;
    this.healthStatus = null;
  }
}
