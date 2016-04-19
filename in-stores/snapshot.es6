import {combineLatest} from 'reactive-observables';

import createHighlightedMapEntityObservable from 'in-services/subscription/highlightedMapEntity';
import createPhysicalHierarchyObservable from 'in-services/subscription/physicalHierarchy';
import createRunningComponentsObservable from 'in-services/subscription/runningComponents';
import createDeployedUnitsObservable from 'in-services/subscription/deployedUnits';
import createFoundationsObservable from 'in-services/subscription/foundations';
import createRawPayloadObservable from 'in-services/subscription/rawPayload';
import createSnapshotObservable from 'in-services/subscription/snapshot';
import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import * as timelineStore from 'in-stores/timeline';
import {alwaysNull} from 'in-services/fixedStreams';


const selectedSnapshotIdStore = createStore({
  name: 'selectedSnapshotId',
  initialValue: null
});
export const selectedSnapshotId = selectedSnapshotIdStore.observable.distinct();

export const selectedSnapshot = createTrackingStore({
  name: 'selectedSnapshot',
  observable: selectedSnapshotId.flatMap(snapshotId => {
    if (snapshotId) {
      return getSnapshot(snapshotId);
    }
    return alwaysNull;
  })
}).observable;

export const selectedSnapshotWithId = createTrackingStore({
  name: 'selectedSnapshotWithId',
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

export function getSnapshot(snapshotId) {
  return timelineStore.timeframe.flatMap(timeframe =>
    createSnapshotObservable({snapshotId, time: timeframe.to}));
}

export function getPhysicalHierarchy(snapshotId) {
  return timelineStore.timeframe.flatMap(timeframe =>
    createPhysicalHierarchyObservable({snapshotId, time: timeframe.to}));
}

export function getHighlightedMapEntity(snapshotId) {
  return createHighlightedMapEntityObservable(snapshotId);
}

export function getFoundations(snapshotId) {
  return createFoundationsObservable(snapshotId);
}

export function getRunningComponents(snapshotId) {
  return timelineStore.timeframe.flatMap(timeframe =>
    createRunningComponentsObservable({snapshotId, time: timeframe.to}));
}

export function getDeployedUnits(snapshotId) {
  return timelineStore.timeframe.flatMap(timeframe =>
    createDeployedUnitsObservable({snapshotId, time: timeframe.to}));
}

export function getRawPayload(snapshotId, payloadName) {
  return createRawPayloadObservable({snapshotId, payloadName});
}

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('snapshotId' in query) {
    const snapshotId = decodeURIComponent(query.snapshotId);
    selectedSnapshotIdStore.applyStateMutation(() => snapshotId);
  } else {
    selectedSnapshotIdStore.applyStateMutation(() => null);
  }
});
