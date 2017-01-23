import {parse} from 'lucene';

import {query$} from 'in-stores/search/query';
import {createStore} from 'in-stores/store';

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


query$
  .subscribe(rawQuery => {
    try {
      const parsedQuery = parse(rawQuery);
      errorStore.mutateTo(null);
      parsedQueryStore.mutateTo(parsedQuery);
    } catch (e) {
      errorStore.mutateTo(e.message);
    }
  });
