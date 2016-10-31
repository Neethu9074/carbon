import {combineLatest} from 'reactive-observables';

import {alwaysEmptyArray} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {createStore} from 'in-stores/store';

const selectedSnapshotIdsStore = createStore({
  name: 'in-views/tableView/stores/selectedSnapshots/selectedSnapshotIds',
  initialValue: []
});
export const selectedSnapshotIds$ = selectedSnapshotIdsStore
  .observable
  .distinct();

export function toggleSnapshotId(snapshotId) {
  selectedSnapshotIdsStore.applyStateMutation(selectedSnapshotIds => {
    const result = selectedSnapshotIds.slice();
    const i = result.indexOf(snapshotId);

    if (i === -1) {
      result.push(snapshotId);
      result.sort();
    } else {
      result.splice(i, 1);
    }

    return result;
  });
}

export function clearSelectedSnapshots() {
  selectedSnapshotIdsStore.mutateTo([]);
}

export const selectedSnapshots$ = selectedSnapshotIds$
  .flatMap(snapshotIds => {
    if (snapshotIds.length === 0) {
      return alwaysEmptyArray;
    }

    return combineLatest(snapshotIds.map(id => getSnapshot(id).startWith(null)));
  });

export function isSelected(snapshotId) {
  return selectedSnapshotIds$
    .map(selectedSnapshotIds => selectedSnapshotIds.indexOf(snapshotId) !== -1)
    .distinct();
}
