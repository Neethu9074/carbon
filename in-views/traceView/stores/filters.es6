export {setTypeFilter, removeTypeFilter} from 'in-stores/search/keywords/type';
import {createTrackingStore} from 'in-stores/store';
import {query$} from 'in-stores/search/query';

import {containsTypeFilter} from 'in-stores/search/keywords/type';

export const typeFilter$ = createTrackingStore({
  name: 'traceView/stores/filters/eventFilterStore',
  observable: query$.map(query => {
    if (containsTypeFilter(query, 'eum', false)) {
      return 'eum';
    } else if (containsTypeFilter(query, 'eum', true)) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;
