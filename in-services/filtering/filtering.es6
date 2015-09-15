import Immutable from 'immutable';

export function createTagFilter(tag) {
  return Immutable.Map({
    type: 'tag',
    label: tag,
    icon: 'timeline',
    tooltip: 'Filter components for the tag ' + tag,
    predicate: snapshot => {
      const tags = snapshot.get('tags');
      if (tags) {
        return tags.some(t => t.indexOf(tag) !== -1);
      }
      return false;
    }
  });
}
