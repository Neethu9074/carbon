/* global process:false */

import {combineLatest} from 'reactive-observables';

import memoize from 'in-services/util/memoizingObservableGenerator';
import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {physicalViewStructure$} from 'in-stores/view';
import {getSnapshot} from 'in-stores/snapshot';
import {getSingular} from 'in-sdk/pluginName';
import {createStore} from 'in-stores/store';
import {getLabel} from 'in-sdk/snapshot';


const queryStore = createStore({
  name: 'tableView/query',
  initialValue: ''
});

export const query$ = queryStore.observable.distinct();

export function setQuery(query) {
  queryStore.applyStateMutation(() => query);
}

export const queryParts$ = query$
  .debounce(process.env.IS_TEST ? 0 : 200)
  .map(query => {
    query = query.trim();
    return query.split(' ')
      .filter(p => p.length > 2)
      .map(p => p.toLowerCase());
  });


const severityStore = createStore({
  name: 'tableView/severity',
  initialValue: 0
});

export const severity$ = severityStore.observable.distinct();

export function setSeverity(severity) {
  severityStore.applyStateMutation(() => severity);
}


export const isFilterActive$ = combineLatest([
    queryParts$,
    severity$
  ])
  .map(([queryParts, severity]) => queryParts.length > 0 || severity > 0)
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
    return combineLatest([
        getSnapshot(snapshotId).startWith(null),
        getHealthInfoAtFocusedMoment(snapshotId).startWith(null)
      ])
      .map(([snapshot, healthInfo]) => {
        return {
          id: snapshotId,
          label: snapshot ? getLabel(snapshot).toLowerCase() : '',
          pluginName: snapshot ? getSingular(snapshot.get('plugin')).toLowerCase() : '',
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
    queryParts$,
    severity$,
    searchablePhysicalViewData$
  ]).map(([queryParts, severity, searchableData]) => {
    const matchingIds = [];
    const queryFilterActive = queryParts.length > 0;
    const severityFilterActive = severity > 0;

    for (let i = 0, len = searchableData.length; i < len; i++) {
      const data = searchableData[i];
      const queryMatch = !queryFilterActive || isMatch(data, queryParts);
      const severityMatch = !severityFilterActive || data.maxSeverity >= severity;
      if (queryMatch && severityMatch) {
        matchingIds.push(data.id);
      }
    }

    return matchingIds;
  });


function isMatch(viewData, queryParts) {
  for (let i = 0, len = queryParts.length; i < len; i++) {
    const part = queryParts[i];
    if (viewData.label.indexOf(part) !== -1) {
      return true;
    } else if (viewData.pluginName.indexOf(part) !== -1) {
      return true;
    }
  }

  return false;
}
