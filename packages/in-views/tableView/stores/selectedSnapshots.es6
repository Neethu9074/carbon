import { combineLatest } from 'reactive-observables';

import { setOrDeleteMatrixKey, navigationParameters$ } from 'in-stores/navigation';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { getSnapshot } from 'in-stores/snapshot';

export const selectedSnapshotIds$ = createTrackingStore({
  name: 'tableView/stores/selectedSnapshots/selectedSnapshotIds',
  observable: navigationParameters$
    .map(params => {
      const encodedMetrics = params.matrix.snapshotIds;
      if (!encodedMetrics) {
        return [];
      }

      return encodedMetrics.split(',');
    })
    .distinct()
}).observable;

export function toggleSnapshotId(snapshotId) {
  selectedSnapshotIds$.once(selectedSnapshotIds => {
    selectedSnapshotIds = selectedSnapshotIds.slice();
    const i = selectedSnapshotIds.indexOf(snapshotId);

    if (i === -1) {
      selectedSnapshotIds.push(snapshotId);
    } else {
      selectedSnapshotIds.splice(i, 1);
    }

    setOrDeleteMatrixKey('snapshotIds', selectedSnapshotIds.join(','));
  });
}

export function clearSelectedSnapshots() {
  setOrDeleteMatrixKey('snapshotIds');
}

export const selectedSnapshots$ = selectedSnapshotIds$.flatMap(snapshotIds => {
  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return combineLatest(snapshotIds.map(id => getSnapshot(id)), false);
});

export function isSelected(snapshotId) {
  return selectedSnapshotIds$.map(selectedSnapshotIds => selectedSnapshotIds.indexOf(snapshotId) !== -1).distinct();
}
