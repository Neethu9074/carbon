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
  name: 'tableView/search',
  initialValue: ''
});

export const query$ = queryStore.observable.distinct();

export function setQuery(query) {
  queryStore.applyStateMutation(() => query);
}


export const snapshotIdsInPhysicalView$ = physicalViewStructure$
  .throttle(10000)
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
          label: snapshot ? getLabel(snapshot) : '',
          pluginName: snapshot ? getSingular(snapshot.get('plugin')) : '',
          maxSeverity: healthInfo ? healthInfo.get('maxSeverity', 0) : -1
        };
      })
      .startWith({
        id: snapshotId,
        label: '',
        pluginName: '',
        maxSeverity: -1
      });
  },

  snapshotId => snapshotId
);


export const searchablePhysicalViewData$ = snapshotIdsInPhysicalView$
  .flatMap(snapshotIds => combineLatest(snapshotIds.map(getSearchableData)))
  .throttle(process.env.IS_TEST ? 5000 : 0);
