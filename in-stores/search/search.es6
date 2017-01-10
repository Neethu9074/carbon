import {combineLatest} from 'reactive-observables';

import createSearchSubscription from 'in-services/subscription/search';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import searchContexts$ from 'in-stores/search/searchContexts';
import {isMapView$} from 'in-stores/navigation/view';
import {alwaysNull} from 'in-services/fixedStreams';
import {transformQuery} from 'in-services/search';
import {focusedMoment$} from 'in-stores/timeline';
import {view$} from 'in-stores/view';

const rawQueryStore = createStore({
  name: 'search/inputString',
  value: ''
});
export const rawQuery$ = rawQueryStore.observable.distinct();


navigationParameters$
  .subscribe(params => {
    const query = params.query;
    if ('q' in query) {
      rawQueryStore.mutateTo(decodeURIComponent(query.q));
    } else {
      rawQueryStore.mutateTo('');
    }
  });

rawQuery$
  .skipFirst()
  .debounce(500)
  .subscribe(rawQuery => {
    mutateUrl(navParams => {
      navParams.query.q = encodeURIComponent(rawQuery);
      return navParams;
    });
  });


const parsedQueryStore = createStore({
  name: 'search/parsedQuery',
  initialValue: null
});
export const parsedQuery$ = parsedQueryStore.observable;
export const luceneQuery$ = parsedQuery$
  .map(parsed => parsed ? parsed.luceneQuery : null)
  .distinct();


const lastQueryChangeTime = createStore({
  name: 'search/lastQueryChangeTime',
  initialValue: 0
});
export const lastQueryChangeTime$ = lastQueryChangeTime.observable;
parsedQuery$.subscribe(() => lastQueryChangeTime.mutateTo(Date.now()));


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


export function setInputString(newString) {
  rawQueryStore.mutateTo(newString);
}


export function mutateInputString(fn) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(fn(decodeURIComponent(navParams.query.q || '')));
    return navParams;
  });
}


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
