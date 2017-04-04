import { removeKeyword, setKeyword, containsKeyword } from 'in-stores/search/keywords';
import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const typeFilter$ = createTrackingStore({
  name: 'traceView/stores/filters/eventFilterStore',
  observable: query$.map(query => {
    if (containsKeyword(query, 'trace.type', 'eum')) {
      return 'eum';
    } else if (containsKeyword(query, 'trace.type', 'server')) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;

export function setTypeFilter(value) {
  setKeyword('trace.type', value);
}

export function removeTypeFilter() {
  removeKeyword('trace.type');
}
