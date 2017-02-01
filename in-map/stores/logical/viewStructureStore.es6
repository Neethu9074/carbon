import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {searchMatches$} from 'in-stores/search/searchMatches';
import {focusedMoment$} from 'in-stores/timeline';
import {getIn} from 'in-services/settings';
import {view$} from 'in-stores/view';

const noSearchMatches = {
  size: 0,
  contains() {
    return false;
  }
};

export function getViewStructure() {
  return combineLatest([view$, focusedMoment$, searchMatches$, getIn(['map', 'logical', 'numServiceHops'], 0)])
     .flatMap(([viewType, focusedMoment, _searchMatches, numServiceHops]) => {
       _searchMatches = _searchMatches || noSearchMatches;
       if (_searchMatches.size === 0) {
         _searchMatches = noSearchMatches;
       }
       return createViewStructureObservable({viewType, time: focusedMoment})
              .map(_viewStructure => {
                const serviceIds = {};

                _viewStructure.get('children').forEach(service => {
                  const serviceId = service.get('id');
                  if (_searchMatches.contains(serviceId)) {
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
                    serviceIds
                  }
                };
              });
     });
}
