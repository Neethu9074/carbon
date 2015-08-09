

import * as ro from 'reactive-observables';

import {getWiredSnapshots} from 'in-sdk/snapshot';

import {create} from '../conveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';
import {only, isIdEqual} from '../util/snapshots';


export default function createStore(name='???') {
  const roSpec = {emitLatestOnSubscribe: true};

  let subscribedSnapshotId = null;
  let selectedSnapshotSubscription = null;
  const selectedSnapshot = ro.create(roSpec);

  // we are writing this value to some object so that we can inspect this
  // prop for debugging purposes
  selectedSnapshot.storeName = name;

  // initialize it with a default value so that subscribers will get an
  // initial value
  selectedSnapshot.emit(null);

  const wiredSnapshots = selectedSnapshot.transform({
    emitLatestOnSubscribe: true,

    shouldRetransform(previousSnapshot, newSnapshot) {
      return !isIdEqual(previousSnapshot, newSnapshot);
    },

    transform(snapshot) {
      return getWiredSnapshots(snapshot);
    }
  });

  return {
    selectedSnapshot,
    wiredSnapshots,
    select,
    clear
  };

  function select(snapshotId) {
    if (isIdEqual(subscribedSnapshotId, snapshotId)) {
      return;
    }

    subscribedSnapshotId = snapshotId;
    disposeSnapshotSubscription();

    selectedSnapshotSubscription = only(
      create(
        SnapshotConveyer,
        {pluginId: snapshotId.get('pluginId')}
      ),
      snapshotId
    )
    .subscribe(snapshot => {
      selectedSnapshot.emit(snapshot);
    });
  }

  function clear() {
    if(subscribedSnapshotId !== null) {
      subscribedSnapshotId = null;
      disposeSnapshotSubscription();
      selectedSnapshot.emit(null);
    }
  }

  function disposeSnapshotSubscription() {
    if (selectedSnapshotSubscription) {
      selectedSnapshotSubscription.dispose();
      selectedSnapshotSubscription = null;
    }
  }

}
