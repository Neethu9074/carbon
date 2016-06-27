/* global process:false */

import {combineLatest} from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {physicalViewStructure$} from 'in-stores/view';
import {createStore} from 'in-stores/store';


const severityStore = createStore({
  name: 'tableView/severity',
  initialValue: 0
});

export const severity$ = severityStore.observable.distinct();

export function setSeverity(severity) {
  severityStore.applyStateMutation(() => severity);
}


export const isFilterActive$ = severity$
  .map(severity => severity > 0)
  .distinct();


export const snapshotIdsInPhysicalView$ = physicalViewStructure$
  .nextFrame()
  .throttle(process.env.IS_TEST ? 0 : 60000)
  .map(viewStructure => {
    const snapshotIds = {};
    const structuresToAnalyzeForSnapshots = viewStructure.get('children').toArray();

    while (structuresToAnalyzeForSnapshots.length !== 0) {
      const structure = structuresToAnalyzeForSnapshots.shift();
      structuresToAnalyzeForSnapshots.push.apply(
        structuresToAnalyzeForSnapshots,
        structure.get('children').toArray()
      );
      snapshotIds[structure.get('id')] = true;
    }

    return Object.keys(snapshotIds);
  });


const getSearchableData = memoize(
  function getSearchableData(snapshotId) {
    return combineLatest([getHealthInfoAtFocusedMoment(snapshotId).startWith(null)])
      .map(([healthInfo]) => {
        return {
          id: snapshotId,
          maxSeverity: healthInfo ? healthInfo.get('maxSeverity', 0) : -1
        };
      });
  },

  snapshotId => snapshotId
);


export const searchablePhysicalViewData$ = snapshotIdsInPhysicalView$
  .flatMap(snapshotIds => combineLatest(snapshotIds.map(getSearchableData)))
  .nextFrame()
  .throttle(process.env.IS_TEST ? 0 : 60000);


export const snapshotIdsInPhysicalViewMatchingFilter$ = combineLatest([
    severity$,
    searchablePhysicalViewData$
  ]).map(([severity, searchableData]) => {
    const matchingIds = [];
    const severityFilterActive = severity > 0;

    for (let i = 0, len = searchableData.length; i < len; i++) {
      const data = searchableData[i];
      const severityMatch = !severityFilterActive || data.maxSeverity >= severity;
      if (severityMatch) {
        matchingIds.push(data.id);
      }
    }

    return matchingIds;
  });
