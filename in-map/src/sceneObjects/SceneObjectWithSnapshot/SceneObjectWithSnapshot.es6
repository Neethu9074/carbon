import snapshotObservable from 'in-services/subscription/snapshot';

import SceneObject from '../SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.addSubscription(snapshotObservable(this).subscribe(snapshot => this.onSnapshotUpdate(snapshot)));
  }

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
    this.onSnapshotUpdated(snapshot);
  }
}
