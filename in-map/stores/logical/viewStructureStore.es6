import { combineLatest } from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { viewGrouping$ } from 'in-stores/view/viewGrouping';
import { debouncedQuery$ } from 'in-stores/search/query';
import { focusedMoment$ } from 'in-stores/timeline';
import { getIn } from 'in-services/settings';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

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
    getIn(['map', 'logical', 'numServiceHops'], 0),
    debouncedQuery$,
    viewGrouping$
  ]).flatMap(([viewType, focusedMoment, _searchMatches, numServiceHops, query, grouping]) => {
    if (!_searchMatches || _searchMatches.size === 0) {
      if (query.trim().length === 0 && role.implicitViewFilter.trim().length === 0) {
        _searchMatches = everythingMatches;
      } else {
        _searchMatches = nothingMatches;
      }
    }
    return createViewStructureObservable({ viewType, time: focusedMoment, grouping }).map(_viewStructure => {
      const serviceIds = {};
      const serviceInstanceIds = {};

      _viewStructure.children.forEach(service => {
        const serviceId = service.id;
        let includeService = _searchMatches.contains(serviceId);

        service.children.forEach(serviceInstance => {
          const serviceInstanceId = serviceInstance.id;
          if (_searchMatches.contains(serviceInstanceId)) {
            includeService = true;
            serviceInstanceIds[serviceInstanceId] = true;
          }
        });

        if (includeService) {
          serviceIds[serviceId] = true;

          if (numServiceHops > 0) {
            const incoming = service.incomingConnections;
            const outgoing = service.outgoingConnections;

            incoming.forEach(_incoming => serviceIds[_incoming.otherId] = true);
            outgoing.forEach(_incoming => serviceIds[_incoming.otherId] = true);
            // TODO: add support for hops > 1
          }
        }
      });

      return {
        viewStructure: _viewStructure,
        includedIds: {
          serviceIds,
          serviceInstanceIds
        }
      };
    });
  });
}
