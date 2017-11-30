import { combineLatest } from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { ID_OF_UNMONITORED_ZONE } from 'in-forge/constants';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { debouncedQuery$ } from 'in-stores/search/query';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSetting$ } from 'in-services/settings';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

const excludeUnmonitoredHosts$ = getSetting$('map_excludeUnmonitoredHosts');

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
    focusedMoment$,
    searchMatches$,
    excludeUnmonitoredHosts$,
    debouncedQuery$,
    viewGrouping$
  ]).flatMap(([viewType, focusedMoment, _searchMatches, excludeUnmonitoredHosts, query, grouping]) => {
    if (!_searchMatches || _searchMatches.size === 0) {
      if (query.trim().length === 0 && role.implicitViewFilter.trim().length === 0) {
        _searchMatches = everythingMatches;
      } else {
        _searchMatches = nothingMatches;
      }
    }
    return createViewStructureObservable({ viewType, time: focusedMoment, grouping }).map(_viewStructure => {
      const groupIds = {};
      const hostIds = {};
      const layerIds = {};

      _viewStructure.children.forEach(group => {
        const groupId = group.id;
        if (excludeUnmonitoredHosts && groupId === ID_OF_UNMONITORED_ZONE) {
          groupIds[groupId] = false;
          return;
        }

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
