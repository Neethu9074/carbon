import Immutable from 'immutable';
import * as ro from 'reactive-observables';

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

/*
 *
**/
export function isMatchingAllActiveFilters(coordinates) {
  if (!coordinates) {
    throw new Error('Invalid argument exception: coordinates');
  }

  return activeFilters.transform({
    emitLatestOnSubscribe: true,

    transform(filters) {
      const filterToBoolObservables = filters.toArray().map(filter => {
        return filter.get('predicate')(coordinates);
      });
      return ro.combineLatest(filterToBoolObservables).map(boolResults => {
         for (let i = 0; i < boolResults.length; i++) {
          if (!boolResults[i]) {
            return false;
          }
        }
        return true;
      });
    },

    shouldRetransform(previousfilters, nextFilters) {
      return previousfilters !== nextFilters;
    }
  });
}
