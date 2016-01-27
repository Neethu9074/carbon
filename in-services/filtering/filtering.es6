import Immutable from 'immutable';

import {getHealth} from '../issueTracker';
import {health} from '../health';

export function createTagFilter(tag) {
  return Immutable.Map({
    type: 'tag',
    label: tag,
    icon: 'timeline',
    tooltip: 'Filter components for the tag ' + tag,
    predicate: (coords) => {
      // TODO will be removed
      return getHealth(coords).map(h => h === health.warning);
    }
  });
}

export const warningFilter = Immutable.Map({
  type: 'issue',
  label: 'only components with warnings',
  icon: 'warning',
  tooltip: 'Filter components that have warnings',
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
