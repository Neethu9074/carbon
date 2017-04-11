import { parse } from 'lucene';

import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { setTimeout, clearTimeout } from 'in-services/chronos';
import { validate } from 'in-services/api/search';
import { always } from 'in-services/fixedStreams';
import { createStore } from 'in-stores/store';

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
export const debouncedQuery$ = query$.debounce(200, { setTimeout, clearTimeout });

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

navigationParameters$.subscribe(params => {
  const query = params.query;
  if ('q' in query) {
    unvalidatedQueryStore.mutateTo(decodeURIComponent(query.q));
  } else {
    unvalidatedQueryStore.mutateTo('');
  }
});

unvalidatedQuery$.skipFirst().debounce(500, { setTimeout, clearTimeout }).subscribe(query => {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(query);
    return navParams;
  });
});

unvalidatedQuery$
  .map(query => {
    try {
      const parsedQuery = parse(query);
      return {
        query: query.trim(),
        parsedQuery,
        error: null
      };
    } catch (e) {
      return {
        query: query.trim(),
        parsedQuery: null,
        error: 'Invalid lucene query.'
      };
    }
  })
  .debounce(200)
  .flatMap(previousResult => {
    if (previousResult.error) {
      return always(previousResult);
    }

    return validate(previousResult.query).map(validationResult => {
      return {
        query: previousResult.query,
        parsedQuery: previousResult.parsedQuery,
        error: validationResult.body.valid ? null : validationResult.body.error
      };
    });
  })
  .subscribe(result => {
    if (result.error) {
      errorStore.mutateTo(result.error);
    } else {
      errorStore.mutateTo(null);
      queryStore.mutateTo(result.query);
      parsedQueryStore.mutateTo(result.parsedQuery);
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
