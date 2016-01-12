import SnapshotsConveyer from './SnapshotsConveyer';
import {create} from './conveyer';

export default class SnapshotConveyer {

  static getUniqueId({id}) {
    return 'snapshot:' + id;
  }

  constructor({id}) {
    this.id = id;

    this.predicate = snapshot => snapshot.get('id') === id;
  }

  start(onNext) {
    this.snapshotsSubscription = create(SnapshotsConveyer, {id: this.id})
      .subscribe(snapshots => {
        const snapshot = snapshots.find(this.predicate, null, undefined);
        if (snapshot !== undefined) {
          onNext(snapshot);
        }
      });
  }

  stop() {
    this.snapshotsSubscription.dispose();
  }
}
