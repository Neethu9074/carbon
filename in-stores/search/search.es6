import {combineLatest} from 'reactive-observables';

import createSearchSubscription from 'in-services/subscription/search';
import {createStore, createTrackingStore} from 'in-stores/store';
import searchContexts$ from 'in-stores/search/searchContexts';
import {isMapView$} from 'in-stores/navigation/view';
import {rawQuery$} from 'in-stores/search/rawQuery';
import {alwaysNull} from 'in-services/fixedStreams';
import {transformQuery} from 'in-services/search';
import {focusedMoment$} from 'in-stores/timeline';
import {view$} from 'in-stores/view';


const parsedQueryStore = createStore({
  name: 'search/parsedQuery',
  initialValue: null
});
export const parsedQuery$ = parsedQueryStore.observable;
export const luceneQuery$ = parsedQuery$
  .map(parsed => parsed ? parsed.luceneQuery : null)
  .distinct();


export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([parsedQuery$, focusedMoment$, isMapView$, view$])
    .flatMap(([parsedQuery, focusedMoment, isMapView, view]) => {
      if (!isMapView ||
          parsedQuery == null ||
          parsedQuery.luceneQuery.length === 0) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: parsedQuery.luceneQuery,
        time: focusedMoment,
        view
      });
    })
}).observable;


const errorStore = createStore({
  name: 'search/queryTranslationError',
  initialValue: null
});
export const error$ = errorStore.observable;


combineLatest([searchContexts$, rawQuery$])
  .nextFrame()
  .subscribe(([searchContexts, rawQuery]) => {
    try {
      const parsedQuery = transformQuery(rawQuery, searchContexts);
      errorStore.mutateTo(null);
      parsedQueryStore.mutateTo(parsedQuery);
    } catch (e) {
      errorStore.mutateTo(e.message);
    }
  });
