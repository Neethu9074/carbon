import {getSnapshot} from 'in-stores/snapshot';

import SceneObject from './SceneObject';

export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id, snapshotId}) {
    super({parent, id});

    snapshotId = snapshotId || id;
    this.addSubscription(getSnapshot(snapshotId)
      .nextFrame()
      .subscribe(snapshot => this.onSnapshotUpdate(snapshot)));
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
