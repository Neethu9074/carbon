import {combineLatest} from 'reactive-observables';

import {createTrackingStore} from 'in-stores/store';
import {searchMatches$} from 'in-stores/search';
import {viewStructure} from 'in-stores/view';


export default createTrackingStore({
  name: 'physicalViewStructure',
  observable: combineLatest([
    viewStructure.distinct(),
    searchMatches$.distinct()
  ]).map(([_viewStructure, _searchMatches]) => {
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
  })
}).observable;
