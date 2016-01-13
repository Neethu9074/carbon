// import {getSnapshot} from 'in-stores/snapshot';

import SceneObject from '../SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    // this.addSubscription(getSnapshot(this.id).subscribe(snapshot => this.onSnapshotUpdate(snapshot)));
  }

  onSnapshotUpdate(snapshot) {
    console.log('SNAPSHOT UPDATE FOR', this.id);
    this.snapshot = snapshot;
    this.onSnapshotUpdated(snapshot);
  }

  dispose() {
    super.dispose();

    this.snapshot = null;
  }
}
