import { combineLatest } from 'reactive-observables';

import { track, TABLE_ENTITY_ADDED, TABLE_ENTITY_CLEARED, TABLE_ENTITY_REMOVED } from 'in-services/tracking/tracking';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { tablePath } from 'in-stores/navigation/paths/mainPaths';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { getSnapshot } from 'in-stores/snapshot';

export const selectedSnapshotIds$ = createTrackingStore({
  name: 'tableView/stores/selectedSnapshots/selectedSnapshotIds',
  observable: navigationParameters$
    .map(location => {
      const encodedMetrics = getMatrixParameter(location, tablePath, 'snapshotIds');
      if (!encodedMetrics) {
        return [];
      }

      return encodedMetrics.split(',');
    })
    .distinct()
}).observable;

export function toggleSnapshotId(snapshotId, entityType) {
  selectedSnapshotIds$.once(selectedSnapshotIds => {
    selectedSnapshotIds = selectedSnapshotIds.slice();
    const i = selectedSnapshotIds.indexOf(snapshotId);

    if (i === -1) {
      track(TABLE_ENTITY_ADDED, { type: entityType });
      selectedSnapshotIds.push(snapshotId);
    } else {
      track(TABLE_ENTITY_REMOVED, { type: entityType });
      selectedSnapshotIds.splice(i, 1);
    }

    mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'snapshotIds', selectedSnapshotIds.join(',')));
  });
}

export function clearSelectedSnapshots() {
  track(TABLE_ENTITY_CLEARED);
  mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'snapshotIds'));
}

export const selectedSnapshots$ = selectedSnapshotIds$.flatMap(snapshotIds => {
  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return combineLatest(
    snapshotIds.map(id => getSnapshot(id)),
    false
  );
});

export function isSelected(snapshotId) {
  return selectedSnapshotIds$.map(selectedSnapshotIds => selectedSnapshotIds.indexOf(snapshotId) !== -1).distinct();
}
