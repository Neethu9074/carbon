import Immutable from 'immutable';

import {createStore} from 'in-stores/store';
import {emptySet} from 'in-services/fixedImmutables';
import {on, emit} from 'in-services/persistentConnection';

// The filter types as defined in the backend.
const filterTypes = {
  tag: 'TAG',
  excludeUnmonitoredHosts: 'EXCLUDE_UNMONITORED_HOSTS'
};

// Filter identification is done via user specific filter ids. Each
// created filter will retrieve a new filter ID.
let filterIdCounter = 0;

const filtersStore = createStore({
  name: 'filters',
  initialValue: emptySet
});


export const filters$ = filtersStore.observable;


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


export function init() {
  // send all filter changes to the backend
  filters$.subscribe(filters => {
    emit('set-filters', filters.toJS());
  });

  // When we reconnect, we need to send the filters to the backend
  // so that it can correctly initialize the view.
  on('reconnect', () => {
    filters$.once(filters => {
      emit('set-filters', filters.toJS());
    });
  });
}
