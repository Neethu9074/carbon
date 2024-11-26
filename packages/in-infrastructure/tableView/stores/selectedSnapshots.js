/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { TABLE_ENTITY_ADDED, TABLE_ENTITY_CLEARED, TABLE_ENTITY_REMOVED } from 'in-services/tracking/tracking';
import { infraEventCTAClicked, infraEventUIInteraction } from 'in-infrastructure/tracking/tracking';
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
      infraEventUIInteraction({ event: TABLE_ENTITY_ADDED, customData: { entityType } });
      selectedSnapshotIds.push(snapshotId);
    } else {
      infraEventUIInteraction({ event: TABLE_ENTITY_REMOVED, customData: { entityType } });
      selectedSnapshotIds.splice(i, 1);
    }

    mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'snapshotIds', selectedSnapshotIds.join(',')));
  });
}

export function clearSelectedSnapshots() {
  infraEventCTAClicked({ event: TABLE_ENTITY_CLEARED });
  mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'snapshotIds'));
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
