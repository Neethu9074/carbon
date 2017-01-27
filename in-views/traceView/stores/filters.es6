import {removeKeyword, setKeyword, containsKeyword} from 'in-stores/search/keywords';
import {createTrackingStore} from 'in-stores/store';
import {query$} from 'in-stores/search/query';

export const typeFilter$ = createTrackingStore({
  name: 'traceView/stores/filters/eventFilterStore',
  observable: query$.map(query => {
    if (containsKeyword(query, 'spanType', 'eum', false)) {
      return 'eum';
    } else if (containsKeyword(query, 'spanType', 'eum', true)) {
      return 'without-eum';
    }
    return 'all';
  })
}).observable;


export function setTypeFilter(value, negate) {
  setKeyword('spanType', value, negate);
}


export function removeTypeFilter() {
  removeKeyword('spanType');
}
