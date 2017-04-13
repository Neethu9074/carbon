import { combineLatest } from 'reactive-observables';

import getHighlightedEntityIds from 'in-services/subscription/highlightedEntityIds';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { selectedSnapshotId$ } from 'in-stores/snapshot';
import { focusedMoment$ } from 'in-stores/timeline';

export const highlightedEntityIds$ = combineLatest([highlightedEntityId$, selectedSnapshotId$])
  .map(([highlightedEntityId, selectedSnapshotId]) => selectedSnapshotId || highlightedEntityId)
  .distinct()
  .flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyArray;
    }

    return focusedMoment$.flatMap(focusedMoment =>
      getHighlightedEntityIds({
        snapshotId: snapshotId,
        time: focusedMoment
      })
    );
  });
