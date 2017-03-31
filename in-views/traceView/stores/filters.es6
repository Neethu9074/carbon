import { removeKeyword, setKeyword, containsKeyword } from 'in-stores/search/keywords';
import { createTrackingStore } from 'in-stores/store';
import { query$ } from 'in-stores/search/query';

export const typeFilter$ = createTrackingStore({
  name: 'traceView/stores/filters/eventFilterStore',
  observable: query$.map(query => {
    if (containsKeyword(query, 'trace.type', 'eum', false)) {
      return 'eum';
    } else if (containsKeyword(query, 'trace.type', 'eum', true)) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;

export function setTypeFilter(value, negate) {
  setKeyword('trace.type', value, negate);
}

export function removeTypeFilter() {
  removeKeyword('trace.type');
}
