import { combineLatest } from 'reactive-observables';

import createViewStructureObservable from 'in-subscription/view';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import createScopeObservable from 'in-subscription/getScope';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { debouncedQuery$ } from 'in-stores/search/query';
import { timeConfig$ } from 'in-stores/time/config';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';
import { fromJS } from 'immutable';

const nothingMatches = {
  contains() {
    return false;
  }
};

const everythingMatches = {
  contains() {
    return true;
  }
};

export function getViewStructure() {
  return combineLatest([
    view$,
    timeConfig$,
    searchMatches$,
    debouncedQuery$,
    viewGrouping$,
    timeConfig$.flatMap(timeConfig => createScopeObservable({ timeConfig }))
  ]).flatMap(([viewType, timeConfig, _searchMatches, query, grouping, scope]) => {
    // solves limitation by scope without search
    if (scope && role.restrictedAccess && !_searchMatches) {
      _searchMatches = fromJS(scope);
    }
    if (!_searchMatches || _searchMatches.size === 0) {
      if (query.trim().length === 0) {
        _searchMatches = everythingMatches;
      } else {
        _searchMatches = nothingMatches;
      }
    }
    return createViewStructureObservable({ viewType, timeConfig, grouping }).map(_viewStructure => {
      const groupIds = {};
      const hostIds = {};
      const layerIds = {};

      _viewStructure.children.forEach(group => {
        const groupId = group.id;

        group.children.forEach(host => {
          const hostId = host.id;
          if (_searchMatches.contains(hostId)) {
            hostIds[hostId] = true;
            groupIds[groupId] = true;
          }

          host.children.forEach(layer => {
            const layerId = layer.id;
            if (_searchMatches.contains(layerId)) {
              layerIds[layerId] = true;
              hostIds[hostId] = true;
              groupIds[groupId] = true;
            }
          });
        });
      });

      return {
        viewStructure: _viewStructure,
        includedIds: {
          groupIds,
          hostIds,
          layerIds
        }
      };
    });
  });
}
