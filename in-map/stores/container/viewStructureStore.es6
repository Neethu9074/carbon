import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {searchMatches$} from 'in-stores/search/searchMatches';
import {viewGrouping$} from 'in-stores/view/viewGrouping';
import {debouncedQuery$} from 'in-stores/search/query';
import {focusedMoment$} from 'in-stores/timeline';
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
  return combineLatest([view$, focusedMoment$, searchMatches$, debouncedQuery$, viewGrouping$])
     .flatMap(([viewType, focusedMoment, _searchMatches, query, grouping]) => {
       if (!_searchMatches || _searchMatches.size === 0) {
         if (query.trim().length === 0 && role.implicitViewFilter.trim().length === 0) {
           _searchMatches = everythingMatches;
         } else {
           _searchMatches = nothingMatches;
         }
       }
       return createViewStructureObservable({viewType, time: focusedMoment, grouping})
              .map(_viewStructure => {
                const groupIds = {};
                const hostIds = {};
                const layerIds = {};

                _viewStructure.get('children').forEach(group => {
                  const groupId = group.get('id');

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
