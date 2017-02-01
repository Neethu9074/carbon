import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {ID_OF_UNMONITORED_ZONE} from 'in-services/unmonitoredZone';
import {searchMatches$} from 'in-stores/search/searchMatches';
import {focusedMoment$} from 'in-stores/timeline';
import {getIn} from 'in-services/settings';
import {view$} from 'in-stores/view';

const excludeUnmonitoredHosts$ = getIn(['map', 'excludeUnmonitoredHosts']);

const noSearchMatches = {
  size: 0,
  contains() {
    return false;
  }
};

export function getViewStructure() {
  return combineLatest([view$, focusedMoment$, searchMatches$, excludeUnmonitoredHosts$])
     .flatMap(([viewType, focusedMoment, _searchMatches, excludeUnmonitoredHosts]) => {
       _searchMatches = _searchMatches || noSearchMatches;
       if (_searchMatches.size === 0) {
         _searchMatches = noSearchMatches;
       }
       return createViewStructureObservable({viewType, time: focusedMoment})
              .map(_viewStructure => {
                const groupIds = {};
                const hostIds = {};
                const layerIds = {};

                _viewStructure.get('children').forEach(group => {
                  const groupId = group.get('id');
                  if (excludeUnmonitoredHosts && groupId === ID_OF_UNMONITORED_ZONE) {
                    groupIds[groupId] = false;
                    return;
                  }

                  if (_searchMatches.contains(groupId)) {
                    groupIds[groupId] = true;
                  }

                  group.get('children').forEach(host => {
                    const hostId = host.get('id');
                    if (_searchMatches.contains(hostId)) {
                      hostIds[hostId] = true;
                      groupIds[groupId] = true;
                    }

                    host.get('children').forEach(layer => {
                      const layerId = layer.get('id');
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
