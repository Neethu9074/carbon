import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {focusedMoment$} from 'in-stores/timeline';
import {searchMatches$} from 'in-stores/search';
import {view$} from 'in-stores/view';

const noSearchMatches = {
  contains() {
    return true;
  }
};

export function getViewStructure() {
  return combineLatest([view$, focusedMoment$, searchMatches$.distinct()])
     .flatMap(([viewType, focusedMoment, _searchMatches]) => {
       _searchMatches = _searchMatches || noSearchMatches;
       return createViewStructureObservable({viewType, time: focusedMoment})
              .map(_viewStructure => {
                const serviceIds = {};

                _viewStructure.get('children').forEach(service => {
                  const serviceId = service.get('id');
                  if (_searchMatches.contains(serviceId)) {
                    serviceIds[serviceId] = true;

                    const incoming = service.get('incomingConnections');
                    const outgoing = service.get('outgoingConnections');

                    incoming.forEach(_incoming => serviceIds[_incoming.get('otherId')] = true);
                    outgoing.forEach(_incoming => serviceIds[_incoming.get('otherId')] = true);
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
