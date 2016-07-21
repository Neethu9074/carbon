import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {focusedMoment$} from 'in-stores/timeline';
import {searchMatches$} from 'in-stores/search';
import {view} from 'in-stores/view';


export function getViewStructure() {
  return combineLatest([view, focusedMoment$, searchMatches$.distinct()])
         .flatMap(([viewType, focusedMoment, _searchMatches]) => {
           return createViewStructureObservable({viewType, time: focusedMoment})
                  .map(_viewStructure => {
                    if (!_searchMatches) {
                      return {
                        viewStructure: _viewStructure
                      };
                    }

                    const groupIds = {};
                    const hostIds = {};
                    const layerIds = {};
                    const includedIds = {
                      groupIds,
                      hostIds,
                      layerIds
                    };

                    _viewStructure.get('children').forEach(group => {
                      const groupId = group.get('id');
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
                      includedIds
                    };
                  });
         });
}
