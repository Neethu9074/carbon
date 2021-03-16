/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { parse } from 'lucene';

import { track, DYNAMIC_FOCUS_QUERY } from 'in-services/tracking/tracking';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { always } from 'in-services/fixedStreams';
import { createStore } from 'in-stores/store';
import { validate } from 'in-api/search';
import { t } from 'in-i18n';

const unvalidatedQueryStore = createStore({
  name: 'search/unvalidatedQuery',
  initialValue: {
    query: '',
    searchContext: undefined
  }
});
export const unvalidatedQuery$ = unvalidatedQueryStore.observable.distinct();

const queryStore = createStore({
  name: 'search/validatedQuery',
  initialValue: null
});
export const query$ = queryStore.observable.distinct().filter(v => v != null);
export const debouncedQuery$ = query$.debounce(200);

let lastQuery = null;

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
  // TODO: there must be a more elegant way to set search context
  let context;
  if (params.pathname === '/traces') {
    context = 'traces';
  }

  const queryParams = params.query;
  if ('q' in queryParams) {
    unvalidatedQueryStore.mutateTo({
      query: queryParams.q,
      searchContext: context
    });
  } else {
    unvalidatedQueryStore.mutateTo({
      query: '',
      searchContext: context
    });
  }
});

unvalidatedQuery$
  .skipFirst()
  .debounce(500)
  .subscribe(query => {
    mutateUrl(navParams => {
      if (!query || !query.query || query.query.length === 1) {
        // remove empty `q` query-param from URL
        delete navParams.query.q;
      } else {
        navParams.query.q = query.query;
      }

      return navParams;
    });
  });

unvalidatedQuery$
  .map(contextQuery => {
    try {
      const query = contextQuery.query.trim();
      const parsedQuery = parse(query);
      return {
        query,
        searchContext: contextQuery.searchContext,
        parsedQuery,
        error: null
      };
    } catch (e) {
      return {
        query: contextQuery.query.trim(),
        searchContext: contextQuery.searchContext,
        parsedQuery: null,
        error: t('in-stores:search.queryInvalidLuceneQuery')
      };
    }
  })
  .debounce(200)
  .flatMap(previousResult => {
    if (previousResult.error) {
      return always(previousResult);
    } else if (previousResult.query.length === 0) {
      return always(previousResult);
    }
    return validate(previousResult.query, previousResult.searchContext).map(validationResult => {
      return {
        query: previousResult.query,
        parsedQuery: previousResult.parsedQuery,
        error: validationResult.body.valid ? null : validationResult.body.error
      };
    });
  })
  .subscribe(result => {
    if (result.query && lastQuery !== result.query) {
      track(DYNAMIC_FOCUS_QUERY, { query: result.query, error: !!result.error });
      lastQuery = result.query;
    }
    if (result.error) {
      errorStore.mutateTo(result.error);
    } else {
      errorStore.mutateTo(null);
      queryStore.mutateTo(result.query);
      parsedQueryStore.mutateTo(result.parsedQuery);
    }
  });

export function setQueryInput(query, context) {
  const contextQuery = {
    query: query,
    searchContext: context
  };

  unvalidatedQueryStore.mutateTo(contextQuery);
}

export function mutateQuery(fn) {
  mutateUrl(navParams => {
    navParams.query.q = fn(navParams.query.q || '');
    return navParams;
  });
}
