'use strict';

import * as ro from 'reactive-observables';
import {create} from 'instana-ui-services/conveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {only} from 'instana-ui-services/util/snapshots';

const roSpec = {emitLatestOnSubscribe: true};

let selectedSnapshotSubscription = null;
export const selectedSnapshot = ro.create(roSpec);
// initialize it with a default value so that subscribers will get an
// initial value
selectedSnapshot.emit(null);

export function select(snapshotId) {
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
  disposeSnapshotSubscription();
  selectedSnapshot.emit(null);
}

function disposeSnapshotSubscription() {
  if (selectedSnapshotSubscription) {
    selectedSnapshotSubscription.dispose();
    selectedSnapshotSubscription = null;
  }
}
