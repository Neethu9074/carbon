import Immutable from 'immutable';

import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {emptySet, emptyMap} from 'in-services/fixedImmutables';
import {getTagFiltersFromQuery} from 'in-services/search';
import {on, emit} from 'in-services/persistentConnection';
import {getIn as getSetting} from 'in-services/settings';
import {focusedMoment$} from 'in-stores/timeline';
import {createStore} from 'in-stores/store';

// The filter types as defined in the backend.
const filterTypes = {
  excludeUnmonitoredHosts: 'EXCLUDE_UNMONITORED_HOSTS',
  freeText: 'FREE_TEXT'
};

// Filter identification is done via user specific filter ids. Each
// created filter will retrieve a new filter ID.
let filterIdCounter = 0;

const filtersStore = createStore({
  name: 'in-stores/filtering/activeFilters',
  initialValue: emptySet
});


// A set of all filters in the form ImmutableSet<Filter> where Filter is of
// the form seen in the backend.
export const filters$ = filtersStore.observable;


const lastFilterChangeTimeStore = createStore({
  name: 'in-stores/filtering/lastFilterChangeTime',
  initialValue: 0
});
export const lastFilterChangeTime$ = lastFilterChangeTimeStore.observable;
filters$.subscribe(() => lastFilterChangeTimeStore.applyStateMutation(() => Date.now()));


export const freeTextFilter$ = filters$
  .map(filters => {
    const freeTextFilters = filters.filter(f => f.get('type') === filterTypes.freeText);
    if (freeTextFilters.size === 0) {
      return '';
    }

    return freeTextFilters.first().getIn(['options', 'rawQuery']);
  })
  .distinct();

// A stream of the form ImmutableSet<String> describing the currently active
// tag filters.
export const filteredTags$ = filters$.map(filters => {
  const freeTextFilters = filters.filter(f => f.get('type') === filterTypes.freeText);
  if (freeTextFilters.size === 0) {
    return emptySet;
  }

  const freeText = freeTextFilters.first()
    .getIn(['options', 'rawQuery']);

  return Immutable.Set(getTagFiltersFromQuery(freeText));
});

export const filterableTags$ = focusedMoment$.flatMap(createFilterableTagsObservable);


function addExcludeUnmonitoredHostsFilter() {
  filtersStore.applyStateMutation(filters => {
    if (filters.some(f => f.get('type') === filterTypes.excludeUnmonitoredHosts)) {
      return filters;
    }

    const filter = Immutable.Map({
      filterId: filterIdCounter++,
      type: filterTypes.excludeUnmonitoredHosts,
      options: emptyMap
    });

    return filters.add(filter);
  });
}


function removeExcludeUnmonitoredHostsFilter() {
  filtersStore.applyStateMutation(filters => {
    return filters.filter(f => {
      return f.get('type') !== filterTypes.excludeUnmonitoredHosts;
    });
  });
}


export function setFreeTextFilter(luceneQuery, rawQuery) {
  luceneQuery = luceneQuery.trim();
  filtersStore.applyStateMutation(filters => {
    let result = filters.filter(f => {
      return f.get('type') !== filterTypes.freeText;
    });

    if (luceneQuery.length > 2) {
      result = result.add(Immutable.Map({
        filterId: filterIdCounter++,
        type: filterTypes.freeText,
        options: Immutable.Map({query: luceneQuery, rawQuery})
      }));
    }

    return result;
  });
}


export function init() {
  // Respond to the setting changes by adding / removing filters.
  // Exclusion of unmonitored hosts is kind of special as it is
  // currently done via the settings dialog. Under the hood,
  // we only implement one filtering infrastructure though.
  getSetting(['map', 'excludeUnmonitoredHosts'])
    .subscribe(exclude => {
      if (exclude) {
        addExcludeUnmonitoredHostsFilter();
      } else {
        removeExcludeUnmonitoredHostsFilter();
      }
    });

  // send all filter changes to the backend
  filters$.subscribe(filters => {
    emit('set-filters', {newFilters: filters.toJS()});
  });

  // When we reconnect, we need to send the filters to the backend
  // so that it can correctly initialize the view.
  on('reconnect', () => {
    filters$.once(filters => {
      emit('set-filters', {newFilters: filters.toJS()});
    });
  });
}
