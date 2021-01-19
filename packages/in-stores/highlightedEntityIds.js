/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';

import getHighlightedEntityIds from 'in-subscription/highlightedEntityIds';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { selectedSnapshotId$ } from 'in-stores/snapshot';
import { timeConfig$ } from 'in-stores/time/config';

export const highlightedEntityIds$ = combineLatest([highlightedEntityId$, selectedSnapshotId$])
  .map(([highlightedEntityId, selectedSnapshotId]) => selectedSnapshotId || highlightedEntityId)
  .distinct()
  .flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyArray;
    }

    return timeConfig$.flatMap(timeConfig =>
      getHighlightedEntityIds({
        snapshotId: snapshotId,
        timeConfig
      })
    );
  });
