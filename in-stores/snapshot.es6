import {combineLatest} from 'reactive-observables';

import createHighlightedMapEntityObservable from 'in-services/subscription/highlightedMapEntity';
import createPhysicalHierarchyObservable from 'in-services/subscription/physicalHierarchy';
import createRunningComponentsObservable from 'in-services/subscription/runningComponents';
import createServiceInstancesObservable from 'in-services/subscription/serviceInstances';
import createDeployedUnitsObservable from 'in-services/subscription/deployedUnits';
import createFoundationsObservable from 'in-services/subscription/foundations';
import createRawPayloadObservable from 'in-services/subscription/rawPayload';
import createSnapshotObservable from 'in-services/subscription/snapshot';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
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
        return getSnapshot(snapshotId);
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
