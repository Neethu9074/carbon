import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {highlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {getHealthStatus} from 'in-stores/healthStatus';
import {getSnapshot} from 'in-stores/snapshot';

import SceneObject from './SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.addSubscription(getSnapshot(this.id).nextFrame().subscribe(snapshot => this.onSnapshotUpdate(snapshot)));

    this.addSubscription(highlightedEntityId.subscribe(highlightedId => {
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

    if (this.onHealthStatusUpdated) {
      this.onHealthStatusUpdated(healthStatus);
    }
  }

  dispose() {
    super.dispose();

    this.snapshot = null;
    this.healthStatus = null;
  }
}
