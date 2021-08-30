/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { timeout, combineLatest } from '@instana/observables';

import createSnapshotsInTimeframeObservable from 'in-subscription/snapshotsInTimeframe';
import createHighlightedMapEntityObservable from 'in-subscription/highlightedMapEntity';
import createPhysicalHierarchyObservable from 'in-subscription/physicalHierarchy';
import createRunningComponentsObservable from 'in-subscription/runningComponents';
import createSnapshotVersionsObservable from 'in-subscription/snapshotVersions';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import createDeployedUnitsObservable from 'in-subscription/deployedUnits';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { alwaysNull, alwaysEmptyArray } from 'in-services/fixedStreams';
import createrIsEntityOnlineObservable from 'in-subscription/isOnline';
import createFoundationsObservable from 'in-subscription/foundations';
import memoize from 'in-services/util/memoizingObservableGenerator';
import createRawPayloadObservable from 'in-subscription/rawPayload';
import { debouncedQuery$, query$ } from 'in-stores/search/query';
import createSnapshotObservable from 'in-subscription/snapshot';
import createSearchObservable from 'in-subscription/search';
import { pendingResult } from 'in-services/fixedObjects';
import { createTrackingStore } from 'in-stores/store';
import { timeConfig$ } from 'in-stores/time/config';

const selectedSnapshotIdStore = createTrackingStore({
  name: 'snapshot/selectedSnapshotId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if (snapshotIdUrlParameter.name in query) {
        return query[snapshotIdUrlParameter.name];
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
        return timeConfig$.flatMap(timeConfig => createSnapshotObservable({ snapshotId, timeConfig }).startWith(null));
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
      navParams.query[snapshotIdUrlParameter.name] = id;
      return navParams;
    });
  }
}

export function clearSelectedSnapshotId() {
  mutateUrl(navParams => {
    delete navParams.query[snapshotIdUrlParameter.name];
    return navParams;
  });
}

export function getSnapshot(snapshotId, timeConfig) {
  if (!snapshotId) {
    return alwaysNull;
  }

  if (timeConfig === undefined) {
    return timeConfig$.flatMap(timeConfig => createSnapshotObservable({ snapshotId, timeConfig }));
  }
  return createSnapshotObservable({ snapshotId, timeConfig });
}

export function getSnapshotOrDefaultOnTimeout(snapshotId, defaultValue, t, timeConfig) {
  const timeoutSignal = 'signal';

  return combineLatest([
    getSnapshot(snapshotId, timeConfig).startWith(pendingResult),
    timeout(t)
      .map(() => timeoutSignal)
      .startWith(null)
  ])
    .map(([snapshot, signal]) => (snapshot === pendingResult && signal === timeoutSignal ? defaultValue : snapshot))
    .distinct();
}

export function getSnapshots(snapshotIds, { waitForCompletion = false, timeConfig } = {}) {
  // support immutable data structures as well
  if (snapshotIds.toArray) {
    snapshotIds = snapshotIds.toArray();
  }

  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return (
    combineLatest(
      snapshotIds.map(snapshotId => getSnapshot(snapshotId, timeConfig)),
      waitForCompletion
    )
      .nextFrame()
      // Do not show snapshots that are still loading
      .map(snapshots => snapshots.filter(Boolean))
      // We will have lots of incremental updates. One update every few
      // milliseconds is enough.
      .throttle(100)
  );
}

// Search and return the user provided query, the search result and the current
// state of the snapshot resolve:
// {
//   query,
//   snapshots,
//   snapshotIds
// }
// This is useful when automatically responding to search results. Example: In
// the website list, we want to automatically redirect users when no websites
// are configured. In order to implement this based on search, we need to
// differentiate between:
// 1. No search query and no results
// 2. No search query and temporarily no results because snapshots are still
//    being loaded.
// 3. Search query which yields no results
// 4. and the search query which yielded results but which may be loading
export function search({ customQuery = null, view = 'TABLE', restrictResultEntityType = null }) {
  return combineLatest([query$, timeConfig$]).flatMap(([query, timeConfig]) => {
    return createSearchObservable({
      query: customQuery ? customQuery : query,
      timeConfig,
      view,
      restrictResultEntityType
    })
      .flatMap(snapshotIds => {
        return getSnapshots(snapshotIds).map(snapshots => {
          return {
            snapshots,
            snapshotIds,
            query
          };
        });
      })
      .startWith({
        query
      });
  });
}

// This is useful to retrieve a process or host snapshot for another snapshot, e.g. JVM, that is
// located within the physical hierarchy. While the logic looks rather inefficient, the truth is
// that most of this data is already available in the UI. Should we discover that this function
// is used multiple times within the same view and outside of dashboards or sidebars, then we
// should move this logic to the backend.
export const getSnapshotFromPhysicalHierarchyByPlugin = memoize(
  function getSnapshotFromPhysicalHierarchyByPlugin(snapshotId, plugin) {
    return getPhysicalHierarchy({ snapshotId })
      .flatMap(ids =>
        combineLatest(
          ids.map(id => getSnapshot(id)),
          false
        )
      )
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

export function getPhysicalHierarchy({ snapshotId, timeConfig, includeCluster = true, includeKubernetes = true }) {
  if (timeConfig) {
    return createPhysicalHierarchyObservable({ snapshotId, timeConfig, includeCluster, includeKubernetes });
  }

  return timeConfig$.flatMap(timeConfig =>
    createPhysicalHierarchyObservable({ snapshotId, timeConfig, includeCluster, includeKubernetes })
  );
}

export function getHighlightedMapEntity(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createHighlightedMapEntityObservable({ snapshotId, timeConfig }));
}

export function getFoundations(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createFoundationsObservable({ snapshotId, timeConfig }));
}

export function getRunningComponents(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createRunningComponentsObservable({ snapshotId, timeConfig }));
}

export function getDeployedUnits(snapshotId) {
  return timeConfig$.flatMap(timeConfig => createDeployedUnitsObservable({ snapshotId, timeConfig }));
}

export function getRawPayload(snapshotId, payloadName) {
  return timeConfig$
    .flatMap(timeConfig => createRawPayloadObservable({ snapshotId, payloadName, timeConfig }))
    .map(o => o.get('raw_payload'));
}

export function getRawPayloadWithTimestamp(snapshotId, payloadName, timeConfig) {
  if (timeConfig) {
    return createRawPayloadObservable({ snapshotId, payloadName, timeConfig });
  }
  return timeConfig$.flatMap(timeConfig => createRawPayloadObservable({ snapshotId, payloadName, timeConfig }));
}

export function isEntityOnline(snapshotId) {
  return createrIsEntityOnlineObservable({ snapshotId });
}

export function getSnapshotVersions(snapshotId, timeConfig) {
  if (timeConfig === undefined) {
    return timeConfig$.flatMap(_timeConfig =>
      createSnapshotVersionsObservable({ snapshotId, timeConfig: _timeConfig })
    );
  }
  return createSnapshotVersionsObservable({ snapshotId, timeConfig });
}

export function getSnapshotsInTimeframe(customQuery) {
  return combineLatest([timeConfig$, debouncedQuery$])
    .nextFrame()
    .flatMap(([timeConfig, query]) => {
      query = query == null || query.length === 0 ? '' : query;
      query = query || '';
      if (!query) {
        return createSnapshotsInTimeframeObservable({ timeConfig, query: customQuery });
      }
      return createSnapshotsInTimeframeObservable({
        timeConfig,
        query: `${customQuery} AND (${query})`
      });
    });
}

export function shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId }) {
  return getSnapshot(snapshotId)
    .map(() => true)
    .startWith(false);
}
