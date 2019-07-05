import { combineLatest } from 'reactive-observables';

import { isRbacEnabled, unmonitoredHostsEnabled } from 'in-services/featureFlags';
import createViewStructureObservable from 'in-subscription/view';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
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
    debouncedQuery$,
    excludeUnmonitoredHosts$,
    viewGrouping$,
    timeConfig$.flatMap(timeConfig => getScope({ timeConfig }))
  ]).flatMap(([viewType, timeConfig, _searchMatches, query, excludeUnmonitoredHosts, grouping, scope]) => {
    const permittedIds = getPermittedIds(_searchMatches ? _searchMatches.toArray() : null, scope, query);
    return createViewStructureObservable({
      viewType,
      timeConfig,
      unmonitoredHostsExcluded: !(unmonitoredHostsEnabled && !excludeUnmonitoredHosts),
      grouping
    }).map(_viewStructure => {
      const groupIds = {};
      const hostIds = {};
      const layerIds = {};

      _viewStructure.children.forEach(group => {
        // just used for physical, without having influence on container view
        const groupId = group.id;

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
  let hasSearchMatches = (searchMatches && searchMatches.length > 0) || false;
  let hasPermittedScope = (scope && scope.length > 0) || false;
  let isRestricted = isRbacEnabled && role.restrictedAccess;

  if (hasPermittedScope && isRestricted && !hasSearchMatches) {
    return isBlank(query) ? scope : [];
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
