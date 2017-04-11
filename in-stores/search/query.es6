import {parse} from 'lucene';

import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {setTimeout, clearTimeout} from 'in-services/chronos';
import {createStore} from 'in-stores/store';

const unvalidatedQueryStore = createStore({
  name: 'search/unvalidatedQuery',
  value: ''
});
export const unvalidatedQuery$ = unvalidatedQueryStore.observable.distinct();

const queryStore = createStore({
  name: 'search/validatedQuery',
  initialValue: ''
});
export const query$ = queryStore.observable.distinct();
export const debouncedQuery$ = query$.debounce(200, {setTimeout, clearTimeout});

const parsedQueryStore = createStore({
  name: 'search/parsedQuery',
  initialValue: null
});
export const parsedQuery$ = parsedQueryStore.observable;

const errorStore = createStore({
  name: 'search/queryTranslationError',
  initialValue: null
});
export const error$ = errorStore.observable;


navigationParameters$
  .subscribe(params => {
    const query = params.query;
    if ('q' in query) {
      unvalidatedQueryStore.mutateTo(decodeURIComponent(query.q));
    } else {
      unvalidatedQueryStore.mutateTo('');
    }
  });


unvalidatedQuery$
  .skipFirst()
  .debounce(500)
  .subscribe(query => {
    mutateUrl(navParams => {
      navParams.query.q = encodeURIComponent(query);
      return navParams;
    });
  });


unvalidatedQuery$
  .subscribe(unvalidatedQuery => {
    try {
      const parsedQuery = parse(unvalidatedQuery);
      errorStore.mutateTo(null);
      queryStore.mutateTo(unvalidatedQuery);
      parsedQueryStore.mutateTo(parsedQuery);
    } catch (e) {
      errorStore.mutateTo(e.message);
    }
  });


export function setInputString(newString) {
  unvalidatedQueryStore.mutateTo(newString);
}


export function mutateQuery(fn) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(fn(decodeURIComponent(navParams.query.q || '')));
    return navParams;
  });
}
