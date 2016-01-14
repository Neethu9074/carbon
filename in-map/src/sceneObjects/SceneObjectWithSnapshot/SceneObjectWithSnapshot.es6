// import {isMatchingAllActiveFilters} from 'in-services/stores/filters';
import {getSnapshot} from 'in-stores/snapshot';

import SceneObject from '../SceneObject';


export default class SceneObjectWithSnapshot extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.addSubscription(getSnapshot(this.id).nextFrame().subscribe(snapshot => this.onSnapshotUpdate(snapshot)));

    // this.addSubscription(isMatchingAllActiveFilters(this.id).subscribe(isVisible => {
    //   if (isVisible) {
    //     this.show();
    //   } else {
    //     this.hide();
    //   }
    // }));
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
