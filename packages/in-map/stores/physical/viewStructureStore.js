import { combineLatest } from '@instana/observables';

import createViewStructureObservable from 'in-subscription/reducedView';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { hasRestrictedAccess } from 'in-stores/permission';
import { debouncedQuery$ } from 'in-stores/search/query';
import { timeConfig$ } from 'in-stores/time/config';
import { isBlank } from 'in-services/util/string';
import getScope from 'in-subscription/getScope';
import { view$ } from 'in-stores/view';

export function getViewStructure() {
  return combineLatest([
    view$,
    timeConfig$,
    searchMatches$,
    debouncedQuery$,
    viewGrouping$,
    timeConfig$.flatMap(timeConfig => getScope({ timeConfig }))
  ]).flatMap(([viewType, timeConfig, _searchMatches, query, grouping, scope]) => {
    const permittedIds = getPermittedIds(_searchMatches ? _searchMatches.toArray() : null, scope, query);
    return createViewStructureObservable({
      viewType,
      timeConfig,
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

  if (hasPermittedScope && hasRestrictedAccess && !hasSearchMatches) {
    return isBlank(query) ? scope : [];
  }
  if (!hasSearchMatches) {
    if (isBlank(query) && !hasRestrictedAccess) {
      return null; //  everything matches
    } else {
      return []; // nothing matches
    }
  }
  return searchMatches;
}
