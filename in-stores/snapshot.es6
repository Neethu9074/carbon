import {combineLatest} from 'reactive-observables';

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
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {alwaysNull, alwaysEmptyArray} from 'in-services/fixedStreams';
import {createTrackingStore} from 'in-stores/store';
import {focusedMoment$} from 'in-stores/timeline';


const selectedSnapshotIdStore = createTrackingStore({
  name: 'in-stores/snapshot/selectedSnapshotId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('snapshotId' in query) {
        return decodeURIComponent(query.snapshotId);
      }

      return null;
    })
    .distinct()
});
export const selectedSnapshotId = selectedSnapshotIdStore.observable;
export const selectedSnapshotId$ = selectedSnapshotId;


export const selectedSnapshot = createTrackingStore({
  name: 'in-stores/snapshot/selectedSnapshot',
  observable: selectedSnapshotId
    .flatMap(snapshotId => {
      if (snapshotId) {
        return focusedMoment$.flatMap(focusedMoment =>
          createSnapshotObservable({snapshotId, time: focusedMoment})
            .startWith(null)
        );
      }
      return alwaysNull;
    })
    .distinct()
}).observable;
export const selectedSnapshot$ = selectedSnapshot;


export const selectedSnapshotWithId = createTrackingStore({
  name: 'in-stores/snapshot/selectedSnapshotWithId',
  observable: combineLatest([selectedSnapshotId, selectedSnapshot])
    .map(([snapshotId, snapshot]) => {
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
      navParams.query.snapshotId = encodeURIComponent(id);
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
    return focusedMoment$.flatMap(focusedMoment =>
      createSnapshotObservable({snapshotId, time: focusedMoment})
    );
  }

  return createSnapshotObservable({snapshotId, time});
}


export function getSnapshots(snapshotIds, time) {
  // support immutable data structures as well
  if (snapshotIds.toArray) {
    snapshotIds = snapshotIds.toArray();
  }

  if (snapshotIds.length === 0) {
    return alwaysEmptyArray;
  }

  return combineLatest(snapshotIds.map(snapshotId => getSnapshot(snapshotId, time).startWith(null)))
    // Do not show snapshots which are still loading
    .map(snapshots => snapshots.filter(s => s))
    // We will have lots of incremental updates. One update every few
    // milliseconds is enough.
    .throttle(100);
}

export function getSnapshotByHierarchyPlugin(snapshotId, plugin, time) {
  return getPhysicalHierarchy(snapshotId, time)
    .flatMap(ids => combineLatest(ids.map(id => getSnapshot(id)))) // transforms a hierarchy list into a snapshot list
    .map(snapshots => snapshots.filter(snapshot => snapshot.get('plugin') === plugin)) // filters all unmatching pluginIds
    .map(snapshots => (snapshots && snapshots.length > 0) ? snapshots[0] : undefined); // get first hit if available or undefined
}



export function getPhysicalHierarchy(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createPhysicalHierarchyObservable({snapshotId, time: focusedMoment}));
}


export function getHighlightedMapEntity(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createHighlightedMapEntityObservable({snapshotId, time: focusedMoment}));
}


export function getFoundations(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createFoundationsObservable({snapshotId, time: focusedMoment}));
}


export function getRunningComponents(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createRunningComponentsObservable({snapshotId, time: focusedMoment}));
}


export function getDeployedUnits(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createDeployedUnitsObservable({snapshotId, time: focusedMoment}));
}


export function getRawPayload(snapshotId, payloadName) {
  return createRawPayloadObservable({snapshotId, payloadName});
}

export function getServiceInstances(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createServiceInstancesObservable({snapshotId, time: focusedMoment}));
}

export function isEntityOnline(snapshotId) {
  return createrIsEntityOnlineObservable({snapshotId});
}

export function getSnapshotVersions(snapshotId, time) {
  if (time === undefined) {
    return focusedMoment$.flatMap(_time => createSnapshotVersionsObservable({snapshotId, time: _time}));
  }
  return createSnapshotVersionsObservable({snapshotId, time});
}
