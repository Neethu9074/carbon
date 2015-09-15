import Immutable from 'immutable';

import {createStore} from './store';

const emptyList = Immutable.List();
const store = createStore({
  name: 'filters',
  initialValue: emptyList
});

export const activeFilters = store.observable;

export function addFilter(filter) {
  store.applyStateMutation(currentSetOfFilters => {
    if (containsFilter(currentSetOfFilters, filter)) {
      return currentSetOfFilters;
    }

    return currentSetOfFilters.push(filter);
  });
}

export function removeFilter(filter) {
  store.applyStateMutation(currentSetOfFilters => {
    return currentSetOfFilters.filter(eachFilter => !isFilterEqual(eachFilter, filter));
  });
}

export function clearFilters() {
  store.applyStateMutation(() => emptyList);
}

function containsFilter(allFilters, filter) {
  return allFilters.some(eachFilter => isFilterEqual(eachFilter, filter));
}

function isFilterEqual(a, b) {
  return a.get('type') === b.get('type') && a.get('label') === b.get('label');
}
