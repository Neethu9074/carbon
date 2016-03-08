import Immutable from 'immutable';

import createTraceDataObservable from 'in-services/subscription/traceData';
import {createStore} from 'in-stores/store';


const tempData = [];
for (let i = 0; i < 100; i++) {
  tempData[i] = { id: i, name: 'name ' + i, size: (Math.random() * 10000) | 0 };
}

let sortingProperty;
let sortDirection;
let subscription;
let filterString;

// this store is used to handle all the subscriptions
const persistentDataStore = createStore({
  name: 'persistent trace data',
  initialValue: Immutable.fromJS(tempData)
});

function subscribeToBackendData() {
  if (subscription) {
    subscription.dispose();
  }

  subscription = createTraceDataObservable({sortingProperty, sortDirection, filterString})
                  .subscribe(data => persistentDataStore.applyStateMutation(() => data));
}

function resetManipulationProperties() {
  sortingProperty = 'id';
  sortDirection = 'asc';
  filterString = 'test';
}

export function getTraceData() {
  resetManipulationProperties();
  subscribeToBackendData();
  return persistentDataStore.observable;
}

export function setFilterString(filterStr) {
  filterString = filterStr;
  subscribeToBackendData();
}

export function setSortDirection(propertyName, sortDir) {
  sortingProperty = propertyName;
  sortDirection = sortDir;
  subscribeToBackendData();
}
