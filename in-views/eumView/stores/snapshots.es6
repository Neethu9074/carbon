import { combineLatest } from 'reactive-observables';

import { createStore } from 'in-stores/store';
import { getSnapshot } from 'in-stores/snapshot';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import createSearchObservable from 'in-services/subscription/search';

const queryStore = createStore({
  name: ' eumView/search/query',
  initialValue: ''
});
export const query$ = queryStore.observable.distinct();

export const snapshotIds$ = query$.flatMap(query => {
  query = 'entity.selfType:website';

  return combineLatest([timeframe$, focusedMoment$]).flatMap(([timeframe, focusedMoment]) => {
    return createSearchObservable({
      query,
      time: focusedMoment,
      view: 'TABLE',
      timeframe
    }).map(list => list.toArray());
  });
});

export const snapshots$ = snapshotIds$
  .flatMap(snapshotIds => combineLatest(snapshotIds.map(snapshotId => getSnapshot(snapshotId).startWith(null))))
  .debounce(200, { leading: false })
  .map(snapshots => snapshots.filter(snapshot => snapshot));
