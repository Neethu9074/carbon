import { combineLatest } from 'reactive-observables';

import createViewStructureObservable from 'in-subscription/view';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { ID_OF_UNMONITORED_ZONE } from 'in-forge/constants';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { isRbacEnabled } from 'in-services/featureFlags';
import { debouncedQuery$ } from 'in-stores/search/query';
import { timeConfig$ } from 'in-stores/time/config';
import { getSetting$ } from 'in-services/settings';
import { isBlank } from 'in-services/util/string';
import getScope from 'in-subscription/getScope';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

const excludeUnmonitoredHosts$ = getSetting$('map_excludeUnmonitoredHosts');

export function getViewStructure() {
  return combineLatest([
    view$,
    timeConfig$,
    searchMatches$,
    excludeUnmonitoredHosts$,
    debouncedQuery$,
    viewGrouping$,
    timeConfig$.flatMap(timeConfig => getScope({ timeConfig }))
  ]).flatMap(([viewType, timeConfig, _searchMatches, excludeUnmonitoredHosts, query, grouping, scope]) => {
    const permittedIds = getPermittedIds(_searchMatches ? _searchMatches.toArray() : null, scope, query);
    return createViewStructureObservable({ viewType, timeConfig, grouping }).map(_viewStructure => {
      const groupIds = {};
      const hostIds = {};
      const layerIds = {};

      _viewStructure.children.forEach(group => {
        // just used for physical, without having influence on container view
        const groupId = group.id;
        if (excludeUnmonitoredHosts && groupId === ID_OF_UNMONITORED_ZONE) {
          groupIds[groupId] = false;
          return;
        }

        group.children.forEach(host => {
          const hostId = host.id;
          if (permittedIds == null || permittedIds.indexOf(hostId) !== -1) {
            hostIds[hostId] = true;
            groupIds[groupId] = true;
          }

          host.children.forEach(layer => {
            const layerId = layer.id;
            if (permittedIds == null || permittedIds.indexOf(layerId) !== -1) {
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

export function getPermittedIds(searchMatches, scope, query) {
  let hasSearchMatches = searchMatches && searchMatches.length > 0;
  let hasPermittedScope = scope && scope.length > 0;
  let isRestricted = isRbacEnabled && role.restrictedAccess;

  if (hasPermittedScope && isRestricted && !hasSearchMatches) {
    return scope;
  }
  if (!hasSearchMatches) {
    if (isBlank(query) && !isRestricted) {
      return null; //  everything matches
    } else {
      return []; // nothing matches
    }
  }
  return searchMatches;
}
