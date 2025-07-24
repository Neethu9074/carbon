/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { TABLE_ENTITY_ADDED, TABLE_ENTITY_CLEARED, TABLE_ENTITY_REMOVED } from 'in-services/tracking/tracking';
import { infraEventCTAClicked, infraEventUIInteraction } from 'in-infrastructure/tracking/tracking';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { tablePath } from 'in-stores/navigation/paths/mainPaths';
import { navigationParameters$ } from 'in-stores/navigation';
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

export function toggleSnapshotId(snapshotId, entityType, location, navigate) {
  selectedSnapshotIds$.once(selectedSnapshotIds => {
    selectedSnapshotIds = selectedSnapshotIds.slice();
    const i = selectedSnapshotIds.indexOf(snapshotId);

    if (i === -1) {
      infraEventUIInteraction({ event: TABLE_ENTITY_ADDED, customData: { entityType } });
      selectedSnapshotIds.push(snapshotId);
    } else {
      infraEventUIInteraction({ event: TABLE_ENTITY_REMOVED, customData: { entityType } });
      selectedSnapshotIds.splice(i, 1);
    }

    setOrDeleteMatrixKey(location, tablePath, 'snapshotIds', selectedSnapshotIds.join(','));
    navigate(location);
  });
}

export function clearSelectedSnapshots(location, navigate) {
  infraEventCTAClicked({ event: TABLE_ENTITY_CLEARED });
  setOrDeleteMatrixKey(location, tablePath, 'snapshotIds');
  navigate(location, true);
}

export const selectedSnapshots$ = selectedSnapshotIds$.flatMap(snapshotIds => {
  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return combineLatest(
    snapshotIds.map(id => getSnapshot(id)),
    false
  ).map(snapshots => snapshots.filter(Boolean));
});

export function isSelected(snapshotId) {
  return selectedSnapshotIds$.map(selectedSnapshotIds => selectedSnapshotIds.indexOf(snapshotId) !== -1).distinct();
}
