import Immutable from 'immutable';

import {getFullSnapshot} from '../snapshots';

export function createTagFilter(tag) {
  return Immutable.Map({
    type: 'tag',
    label: tag,
    icon: 'timeline',
    tooltip: 'Filter components for the tag ' + tag,
    predicate: (coords) => {
      return getFullSnapshot(coords).map(snapshot => {
        const tags = snapshot.get('tags');
        if (tags) {
          return tags.some(t => t.indexOf(tag) !== -1);
        }
        return false;
      });
    }
  });
}
