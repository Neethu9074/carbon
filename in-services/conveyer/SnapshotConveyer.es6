import {create} from './conveyer';
import SnapshotsConveyer from './SnapshotsConveyer';

export default class SnapshotConveyer {

  static getUniqueId({coordinates}) {
    return 'snapshot:' + coordinates.get('id');
  }

  constructor({coordinates}) {
    this.coordinates = coordinates;

    this.pluginId = this.coordinates.get('pluginId');
    const id = this.coordinates.get('id');
    this.predicate = snapshot => snapshot.get('id') === id;
  }

  start(onNext) {
    this.snapshotsSubscription = create(SnapshotsConveyer, {pluginId: this.pluginId})
      .subscribe(snapshots => {
        const snapshot = snapshots.find(predicate, null, undefined);
        if (snapshot !== undefined) {
          onNext(snapshot);
        }
      });
  }

  stop() {
    this.snapshotsSubscription.dispose();
  }

}
