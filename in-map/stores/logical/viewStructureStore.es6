import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {searchMatches$} from 'in-stores/search/searchMatches';
import {debouncedQuery$} from 'in-stores/search/query';
import {focusedMoment$} from 'in-stores/timeline';
import {getIn} from 'in-services/settings';
import {view$} from 'in-stores/view';
import {role} from 'in-stores/user';

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
  return combineLatest([view$, focusedMoment$, searchMatches$, getIn(['map', 'logical', 'numServiceHops'], 0), debouncedQuery$])
     .flatMap(([viewType, focusedMoment, _searchMatches, numServiceHops, query]) => {
       if (!_searchMatches || _searchMatches.size === 0) {
         if (query.trim().length === 0 && role.implicitViewFilter.trim().length === 0) {
           _searchMatches = everythingMatches;
         } else {
           _searchMatches = nothingMatches;
         }
       }
       return createViewStructureObservable({viewType, time: focusedMoment})
              .map(_viewStructure => {
                const serviceIds = {};
                const serviceInstanceIds = {};

                _viewStructure.get('children').forEach(service => {
                  const serviceId = service.get('id');
                  let includeService = _searchMatches.contains(serviceId);

                  service.get('children').forEach(serviceInstance => {
                    const serviceInstanceId = serviceInstance.get('id');
                    if (_searchMatches.contains(serviceInstanceId)) {
                      includeService = true;
                      serviceInstanceIds[serviceInstanceId] = true;
                    }
                  });

                  if (includeService) {
                    serviceIds[serviceId] = true;

                    if (numServiceHops > 0) {
                      const incoming = service.get('incomingConnections');
                      const outgoing = service.get('outgoingConnections');

                      incoming.forEach(_incoming => serviceIds[_incoming.get('otherId')] = true);
                      outgoing.forEach(_incoming => serviceIds[_incoming.get('otherId')] = true);

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
