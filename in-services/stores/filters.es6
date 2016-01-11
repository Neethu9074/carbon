import * as ro from 'reactive-observables';
import Immutable from 'immutable';

import {createStore} from 'in-stores/store';
import {view} from 'in-stores/view';

const emptyList = Immutable.List();
const store = createStore({
  name: 'filters',
  initialValue: emptyList
});

export const activeFilters = store.observable;

// remove all active tag filers when the view is switched to avoid
// physical map tags filtering to impact filtering on the process view.
view.subscribe(() => removeFiltersWithType('tag'));

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

export function removeFiltersWithType(type) {
  store.applyStateMutation(currentSetOfFilters => {
    return currentSetOfFilters.filter(eachFilter => eachFilter.get('type') !== type);
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


/**
 * tests given coordinates against all active filters and returns a boolean if
 * all tests are passed or not
 *
 * @param {Immutable.Map} coordinates An immutable coordinates map for which
 * to tests against
 * @returns {Observable<bool>} An observable, fires an boolean if filters are changing
 */
export function isMatchingAllActiveFilters(coordinates) {
  if (!coordinates) {
    throw new Error('Invalid argument exception: coordinates');
  }

  // all active filters are transformed to one Observable<bool>. If active filters
  // are changing, this observable will retransform
  return activeFilters.transform({
    emitLatestOnSubscribe: true,

    transform(filters) {
      // map all filters to Array<Observable<bool>>
      const filterToBoolObservables = filters.toArray().map(filter => {
        // extract the predicate and call it which returns an Observable<bool>
        return filter.get('predicate')(coordinates);
      });

      // combine (reduce) all observables to one observable
      return ro.combineLatest(filterToBoolObservables).map(boolResults =>
        // become false if the array contains a false, true if not
        boolResults.indexOf(false) === -1
      );
    },

    shouldRetransform(previousfilters, nextFilters) {
      // since the filters are immutable a reference check is all you need
      return previousfilters !== nextFilters;
    }
  });
}
