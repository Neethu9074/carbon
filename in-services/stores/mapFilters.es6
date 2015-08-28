import Immutable from 'immutable';
import * as ro from 'reactive-observables';

const emptyList = Immutable.List();
const reemitSpec = {emitLatestOnSubscribe: true};

// value in milliseconds
let latestFilters = emptyList;
export const filters = ro.create(reemitSpec);
filters.emit(emptyList);

filters.subscribe(f => latestFilters = f);

export function set(t) {
  filters.emit(t);
}

export function add(filter) {
  set(latestFilters.push(filter));
}

export function remove(filter) {
  const newFilters = latestFilters.filter(f => f !== filter);
  set(newFilters);
}

export function clear() {
  filters.emit(emptyList);
}

export const addTagFilter = createTagAdder(tag => {
  return Immutable.Map({
    type: 'tag',
    label: tag,
    icon: 'timeline',
    predicate: snapshot => {
      const tags = snapshot.get('tags');
      if (tags) {
        return tags.some(t => t.indexOf(tag) !== -1);
      }
      return false;
    }
  });
});

function createTagAdder(fn) {
  return function() {
    const filter = fn.apply(this, arguments);
    set(latestFilters.push(filter));
  };
}
