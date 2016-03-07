import Immutable from 'immutable';

import createTraceDataObservable from 'in-services/subscription/traceData';
import {on, emit} from 'in-services/persistentConnection';
import {createStore} from 'in-stores/store';


const tempData = [];
for (let i = 0; i < 100; i++) {
  tempData[i] = { id: i, name: 'name ' + i, size: (Math.random() * 10000) | 0 };
}
export const traceData = createTraceDataObservable().startWith(Immutable.fromJS(tempData));

const traceDataFilterStringStore = createStore({
  name: 'traceDataFilterString',
  initialValue: ''
});
const traceDataFilterString$ = traceDataFilterStringStore.observable;

const traceDataSortDirectionStore = createStore({
  name: 'traceDataSortDirection',
  initialValue: ''
});
const traceDataSortDirection$ = traceDataSortDirectionStore.observable;

export function setFilterString(filterString) {
  traceDataFilterStringStore.applyStateMutation(() => filterString);
}

export function setSortDirection(propertyName, sortDirection) {
  traceDataSortDirectionStore.applyStateMutation(() => {
    return {
      propertyName,
      sortDirection
    };
  });
}

export function init() {
  // send the current filter string to the backend
  traceDataFilterString$.subscribe(filterString => emit('set-filters', {filterString}));
  traceDataSortDirection$.subscribe(sortDirection => emit('set-trace-data-sort-direction', {sortDirection}));

  // When we reconnect, we need to send the filter string to the backend
  // so that it can correctly initialize the view.
  on('reconnect', () => {
    traceDataFilterString$.once(filterString => emit('set-trace-data-filters', {filterString}));
    traceDataSortDirection$.once(event => emit('set-trace-data-sort-direction', event));
  });
}
