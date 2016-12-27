export {setTypeFilter, removeTypeFilter} from 'in-stores/search/type';
import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search';

import {containsTypeFilter} from 'in-stores/search/type';

export const typeFilter$ = createTrackingStore({
  name: 'in-views/traceView/stores/filters/eventFilterStore',
  observable: rawQuery$.map(query => {
    if (containsTypeFilter(query, 'eum')) {
      return 'eum';
    } else if (containsTypeFilter(query, 'eum', '!=')) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;
