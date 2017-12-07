import { combineLatest } from 'reactive-observables';

import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { getSnapshot } from 'in-stores/snapshot';

export const selectedSnapshotIds$ = createTrackingStore({
  name: 'tableView/stores/selectedSnapshots/selectedSnapshotIds',
  observable: navigationParameters$
    .map(location => {
      const encodedMetrics = getMatrixParameter(location, '/table', 'snapshotIds');
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

    mutateUrl(location => setOrDeleteMatrixKey(location, '/table', 'snapshotIds', selectedSnapshotIds.join(',')));
  });
}

export function clearSelectedSnapshots() {
  mutateUrl(location => setOrDeleteMatrixKey(location, '/table', 'snapshotIds'));
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
