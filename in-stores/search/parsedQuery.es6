import {combineLatest} from 'reactive-observables';

import {createStore} from 'in-stores/store';
import searchContexts$ from 'in-stores/search/searchContexts';
import {query$} from 'in-stores/search/query';
import {transformQuery} from 'in-services/search';


const parsedQueryStore = createStore({
  name: 'search/parsedQuery',
  initialValue: null
});
export const parsedQuery$ = parsedQueryStore.observable;
export const luceneQuery$ = parsedQuery$
  .map(parsed => parsed ? parsed.luceneQuery : null)
  .distinct();


const errorStore = createStore({
  name: 'search/queryTranslationError',
  initialValue: null
});
export const error$ = errorStore.observable;


combineLatest([searchContexts$, query$])
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
