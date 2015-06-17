'use strict';

import * as ro from 'reactive-observables';
import {create} from '../conveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';
import {only, isIdEqual} from '../util/snapshots';

const roSpec = {emitLatestOnSubscribe: true};

let subscribedSnapshotId = null;
let selectedSnapshotSubscription = null;
export const selectedSnapshot = ro.create(roSpec);
// initialize it with a default value so that subscribers will get an
// initial value
selectedSnapshot.emit(null);

export function select(snapshotId) {
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

export function clear() {
  subscribedSnapshotId = null;
  disposeSnapshotSubscription();
  selectedSnapshot.emit(null);
}

function disposeSnapshotSubscription() {
  if (selectedSnapshotSubscription) {
    selectedSnapshotSubscription.dispose();
    selectedSnapshotSubscription = null;
  }
}
