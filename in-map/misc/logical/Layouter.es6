import {combineLatest} from 'reactive-observables';

import {nodePositions$, currentLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import {LOGICAL_LAYOUTING} from 'in-map/misc/TimingConfig';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';


export default function createLayouter() {
  const layoutingSubscription = combineLatest([services.stream,
                                               connections.stream,
                                               currentLayoutingStrategy$,
                                               nodePositions$])
                                .debounce(LOGICAL_LAYOUTING)
                                .map(([_services, _connections, _currentLayoutingStrategy, _nodePositions]) => {
                                  return {
                                    nodes: Object.keys(_services).map(key => _services[key]),
                                    edges: Object.keys(_connections).map(key => _connections[key]),
                                    layoutStrategy: _currentLayoutingStrategy,
                                    nodePositions: _nodePositions
                                  };
                                })
                                .subscribe(({nodes, edges, layoutStrategy, nodePositions}) => {
                                  layoutStrategy(nodes, edges, nodePositions);
                                });

  return {
    dispose
  };

  function dispose() {
    layoutingSubscription.dispose();
  }
}
