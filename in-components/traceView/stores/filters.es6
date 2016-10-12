import {containsTraceTypeFilter} from 'in-stores/search/traces';
import {createTrackingStore} from 'in-stores/store';
import {rawQuery$} from 'in-stores/search';

export {setTraceTypeFilter, removeTraceTypeFilter} from 'in-stores/search/traces';

export const typeFilter$ = createTrackingStore({
  name: 'in-components/traceView/stores/filters/eventFilterStore',
  observable: rawQuery$.map(query => {
    if (containsTraceTypeFilter(query, 'eum')) {
      return 'eum';
    } else if (containsTraceTypeFilter(query, 'eum', '!=')) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;
