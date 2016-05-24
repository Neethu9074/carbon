import Immutable from 'immutable';

import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {emptySet, emptyMap} from 'in-services/fixedImmutables';
import {on, emit} from 'in-services/persistentConnection';
import {getIn as getSetting} from 'in-services/settings';
import {focusedMoment$} from 'in-stores/timeline';
import {createStore} from 'in-stores/store';

// The filter types as defined in the backend.
const filterTypes = {
  tag: 'TAG',
  excludeUnmonitoredHosts: 'EXCLUDE_UNMONITORED_HOSTS'
};

// Filter identification is done via user specific filter ids. Each
// created filter will retrieve a new filter ID.
let filterIdCounter = 0;

const filtersStore = createStore({
  name: 'activeFilters',
  initialValue: emptySet
});


// A set of all filters in the form ImmutableSet<Filter> where Filter is of
// the form seen in the backend.
export const filters$ = filtersStore.observable;

// A stream of the form ImmutableSet<String> describing the currently active
// tag filters.
export const filteredTags$ = filters$.map(filters => {
  return filters.filter(f => f.get('type') === filterTypes.tag)
    .map(f => f.getIn(['options', 'tag']));
});

export const filterableTags$ = focusedMoment$.flatMap(createFilterableTagsObservable);

export function addTagFilter(tag) {
  filtersStore.applyStateMutation(filters => {
    if (containsTagFilter(filters, tag)) {
      return filters;
    }

    return filters.add(createTagFilter(tag));
  });
}


function containsTagFilter(filters, tag) {
  return filters.some(buildTagFilterPredicate(tag));
}


function buildTagFilterPredicate(tag) {
  return filter => {
    return filter.get('type') === filterTypes.tag &&
      filter.getIn(['options', 'tag']) === tag;
  };
}


function createTagFilter(tag) {
  return Immutable.Map({
    filterId: filterIdCounter++,
    type: filterTypes.tag,
    options: Immutable.Map({
      tag
    })
  });
}


export function removeTagFilter(tag) {
  filtersStore.applyStateMutation(filters => {
    return filters.filterNot(buildTagFilterPredicate(tag));
  });
}


export function removeAllTagFilters() {
  filtersStore.applyStateMutation(filters => {
    return filters.filter(f => f.get('type') !== filterTypes.tag);
  });
}


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
