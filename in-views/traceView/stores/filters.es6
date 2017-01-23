export {setTypeFilter, removeTypeFilter} from 'in-stores/search/keywords/type';
import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search/rawQuery';

import {containsTypeFilter} from 'in-stores/search/keywords/type';

export const typeFilter$ = createTrackingStore({
  name: 'traceView/stores/filters/eventFilterStore',
  observable: rawQuery$.map(query => {
    if (containsTypeFilter(query, 'eum')) {
      return 'eum';
    } else if (containsTypeFilter(query, 'eum', '!=')) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;
