import Immutable from 'immutable';

import {getFullSnapshot} from '../snapshots';
import {getHealth} from '../issueTracker';
import {health} from '../health';

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

export const warningFilter = Immutable.Map({
  type: 'issue',
  label: 'only components with warnings',
  icon: 'warning',
  tooltip: 'Filter components that have warning',
  predicate: (coords) => {
    return getHealth(coords).map(h => h === health.warning);
  }
});

export const dangerFilter = Immutable.Map({
  type: 'issue',
  label: 'only components with errors',
  icon: 'critical',
  tooltip: 'Filter components that have errors',
  predicate: (coords) => {
    return getHealth(coords).map(h => h === health.danger);
  }
});
