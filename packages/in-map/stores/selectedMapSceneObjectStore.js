/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { selectedSnapshotId, getHighlightedMapEntity } from 'in-stores/snapshot';
import { createTrackingStore } from 'in-stores/store';
import { alwaysNull } from 'in-services/fixedStreams';

export const selectedSnapshotIdForHighlightingInMap$ = createTrackingStore({
  name: 'scene/selectedSnapshotIdForHighlightingInMap',
  observable: selectedSnapshotId.flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysNull;
    }
    return getHighlightedMapEntity(snapshotId);
  })
}).observable;
