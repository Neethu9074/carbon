

import _ from 'lodash';
import Immutable from 'immutable';
import * as ro from 'reactive-observables';

import * as constants from 'in-forge/constants';

import * as mapFilters from '../stores/mapFilters';
import {create} from '../conveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';

const maxSuggestionsPerGroup = 5;

export function getSuggestions(query) {
  // each of these getTagSuggestions functions must be of the form:
  // string => Immutable.Map[]
  // the following code will merge the different suggestion types and turn
  // this into an immutable list.
  const suggestionObservables = [
    getTagSuggestions(query)
  ];

  suggestionObservables.unshift(mapFilters.filters);

  return ro.combineLatest(suggestionObservables)
    .map(values => {
      const activeFilters = values[0];
      return Immutable.List(values.slice(1)
        .reduce((agg, suggestions) => {
          return agg.concat(suggestions.slice(0, maxSuggestionsPerGroup));
        }, [])
        .filter(suggestion => {
          return !activeFilters.some(filter => {
            return filter.get('type') === suggestion.get('type') &&
              filter.get('label') === suggestion.get('label');
          });
        }));
    });
}

function getTagSuggestions(query) {
  const lowerCaseQuery = query.toLowerCase();

  return create(SnapshotConveyer, {pluginId: constants.plugins.os})

    // snapshots => tags
    .map(snapshots => {
      if (!snapshots) {
        return [];
      }

      let tags = [];

      snapshots.forEach(snapshot => {
        const t = snapshot.get('tags');
        if (t) {
          tags = tags.concat(t.toArray());
        }
      });

      return _.uniq(tags);
    })

    // tags => tags containing the given query
    .map(tags => {
      return tags.filter(tag => {
        return tag.toLowerCase().indexOf(lowerCaseQuery) !== -1;
      });
    })

    // tags => filter predicate builders
    .map(tags => tags.map(tag => createTagFilter(tag)));
}

function createTagFilter(tag) {
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
