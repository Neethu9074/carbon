import { combineLatest } from 'reactive-observables';

import createHighlightedMapEntityObservable from 'in-services/subscription/highlightedMapEntity';
import createPhysicalHierarchyObservable from 'in-services/subscription/physicalHierarchy';
import createRunningComponentsObservable from 'in-services/subscription/runningComponents';
import createSnapshotVersionsObservable from 'in-services/subscription/snapshotVersions';
import createServiceInstancesObservable from 'in-services/subscription/serviceInstances';
import createDeployedUnitsObservable from 'in-services/subscription/deployedUnits';
import createrIsEntityOnlineObservable from 'in-services/subscription/isOnline';
import createFoundationsObservable from 'in-services/subscription/foundations';
import createRawPayloadObservable from 'in-services/subscription/rawPayload';
import createSnapshotObservable from 'in-services/subscription/snapshot';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { alwaysNull, alwaysEmptyArray } from 'in-services/fixedStreams';
import createSearchObservable from 'in-services/subscription/search';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { createTrackingStore } from 'in-stores/store';

const selectedSnapshotIdStore = createTrackingStore({
  name: 'snapshot/selectedSnapshotId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('snapshotId' in query) {
        return query.snapshotId;
      }

      return null;
    })
    .distinct()
});
export const selectedSnapshotId = selectedSnapshotIdStore.observable;
export const selectedSnapshotId$ = selectedSnapshotId;

export const selectedSnapshot = createTrackingStore({
  name: 'snapshot/selectedSnapshot',
  observable: selectedSnapshotId
    .flatMap(snapshotId => {
      if (snapshotId) {
        return focusedMoment$.flatMap(focusedMoment =>
          createSnapshotObservable({ snapshotId, time: focusedMoment }).startWith(null)
        );
      }
      return alwaysNull;
    })
    .distinct()
}).observable;
export const selectedSnapshot$ = selectedSnapshot;

export const selectedSnapshotWithId = createTrackingStore({
  name: 'snapshot/selectedSnapshotWithId',
  observable: combineLatest([selectedSnapshotId, selectedSnapshot]).map(([snapshotId, snapshot]) => {
    if (!snapshotId) {
      return {
        snapshotId: null,
        snapshot: null
      };
    } else if (snapshot && snapshot.get('id') !== snapshotId) {
      return {
        snapshotId: snapshotId,
        snapshot: null
      };
    }

    return {
      snapshotId,
      snapshot
    };
  })
}).observable;

export function setSelectedSnapshotId(id) {
  if (id == null) {
    clearSelectedSnapshotId();
  } else {
    mutateUrl(navParams => {
      delete navParams.query.incidentId;
      delete navParams.query.objectiveId;
      navParams.query.snapshotId = id;
      return navParams;
    });
  }
}

export function clearSelectedSnapshotId() {
  mutateUrl(navParams => {
    delete navParams.query.snapshotId;
    return navParams;
  });
}

export function getSnapshot(snapshotId, time) {
  if (time === undefined) {
    return focusedMoment$.flatMap(focusedMoment => createSnapshotObservable({ snapshotId, time: focusedMoment }));
  }

  return createSnapshotObservable({ snapshotId, time });
}

export function getSnapshots(snapshotIds, time) {
  // support immutable data structures as well
  if (snapshotIds.toArray) {
    snapshotIds = snapshotIds.toArray();
  }

  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return (
    combineLatest(snapshotIds.map(snapshotId => getSnapshot(snapshotId, time).startWith(null)))
      // Do not show snapshots which are still loading
      .map(snapshots => snapshots.filter(s => s))
      // We will have lots of incremental updates. One update every few
      // milliseconds is enough.
      .throttle(100)
  );
}

export function getSnapshotsByQuery(query) {
  return combineLatest([timeframe$, focusedMoment$]).flatMap(([timeframe, focusedMoment]) =>
    createSearchObservable({
      query,
      time: focusedMoment,
      view: 'TABLE',
      timeframe
    }).flatMap(ids => getSnapshots(ids.toArray(), focusedMoment))
  );
}

// This is useful to retrieve a process or host snapshot for another snapshot, e.g. JVM, that is
// located within the physical hierarchy. While the logic looks rather inefficient, the truth is
// that most of this data is already available in the UI. Should we discover that this function
// is used multiple times within the same view and outside of dashboards or sidebars, then we
// should move this logic to the backend.
export const getSnapshotFromPhysicalHierarchyByPlugin = memoize(
  function getSnapshotFromPhysicalHierarchyByPlugin(snapshotId, plugin) {
    return getPhysicalHierarchy(snapshotId)
      .flatMap(ids => combineLatest(ids.map(id => getSnapshot(id).startWith(null))))
      .debounce(300)
      .map(snapshots => {
        for (let i = 0, len = snapshots.length; i < len; i++) {
          const snapshot = snapshots[i];

          // Snapshots may not exist since we are forcing the stream to start with null so
          // that combineLatest can fire immediately.
          if (snapshot && snapshot.get('plugin') === plugin) {
            return snapshot;
          }
        }
        return undefined;
      })
      .distinct();
  },
  (snapshotId, plugin) => snapshotId + plugin,
  3000
);

export function getPhysicalHierarchy(snapshotId, includeCluster = true) {
  return focusedMoment$.flatMap(focusedMoment =>
    createPhysicalHierarchyObservable({ snapshotId, time: focusedMoment, includeCluster })
  );
}

export function getHighlightedMapEntity(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createHighlightedMapEntityObservable({ snapshotId, time: focusedMoment })
  );
}

export function getFoundations(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => createFoundationsObservable({ snapshotId, time: focusedMoment }));
}

export function getRunningComponents(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createRunningComponentsObservable({ snapshotId, time: focusedMoment })
  );
}

export function getDeployedUnits(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => createDeployedUnitsObservable({ snapshotId, time: focusedMoment }));
}

export function getRawPayload(snapshotId, payloadName) {
  return focusedMoment$.flatMap(focusedMoment =>
    createRawPayloadObservable({ snapshotId, payloadName, time: focusedMoment })
  );
}

export function getServiceInstances(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => createServiceInstancesObservable({ snapshotId, time: focusedMoment }));
}

export function isEntityOnline(snapshotId) {
  return createrIsEntityOnlineObservable({ snapshotId });
}

export function getSnapshotVersions(snapshotId, time) {
  if (time === undefined) {
    return focusedMoment$.flatMap(_time => createSnapshotVersionsObservable({ snapshotId, time: _time }));
  }
  return createSnapshotVersionsObservable({ snapshotId, time });
}
