/* global process:false */

import {combineLatest} from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {physicalViewStructure$} from 'in-stores/view';
import {searchMatches$} from 'in-stores/search';
import {createStore} from 'in-stores/store';


const severityStore = createStore({
  name: 'tableView/severity',
  initialValue: 0
});

export const severity$ = severityStore.observable.distinct();

export function setSeverity(severity) {
  severityStore.applyStateMutation(() => severity);
}


export const isFilterActive$ = combineLatest([severity$, searchMatches$])
  .map(([severity, searchMatches]) => severity > 0 || searchMatches != null)
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
    searchablePhysicalViewData$,
    searchMatches$
  ]).map(([severity, searchableData, searchMatches]) => {
    let matchingIds = [];

    const severityFilterActive = severity > 0;
    if (severityFilterActive) {
      for (let i = 0, len = searchableData.length; i < len; i++) {
        const data = searchableData[i];
        if (data.maxSeverity >= severity) {
          if ((searchMatches && searchMatches.contains(data.id)) || !searchMatches) {
            matchingIds.push(data.id);
          }
        }
      }
    } else if (searchMatches) {
      matchingIds = searchMatches.toArray();
    } else {
      matchingIds = searchableData.map(data => data.id);
    }

    return matchingIds;
  });
