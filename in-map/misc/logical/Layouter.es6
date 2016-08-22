import {combineLatest} from 'reactive-observables';

import {nodePositions$, currentLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import {LOGICAL_LAYOUTING} from 'in-map/misc/TimingConfig';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';
import {focusId} from 'in-map/services/focus';
import {ZERO} from 'in-map/misc/fixedVectors';


export default function createLayouter() {
  let firstLayoutDone = false;

  const layoutingSubscription = combineLatest([services.stream,
                                               connections.stream,
                                               currentLayoutingStrategy$,
                                               nodePositions$])
                                .map(([_services, _connections, _currentLayoutingStrategy, _nodePositions]) => {
                                  return {
                                    nodes: Object.keys(_services).map(key => _services[key]),
                                    edges: Object.keys(_connections).map(key => _connections[key]),
                                    layoutStrategy: _currentLayoutingStrategy,
                                    nodePositions: _nodePositions
                                  };
                                })
                                .debounce(LOGICAL_LAYOUTING)
                                .subscribe(({nodes, edges, layoutStrategy, nodePositions}) => {
                                  layoutStrategy(nodes, edges, nodePositions);

                                  if (!firstLayoutDone) {
                                    firstLayoutDone = true;
                                    focusId();
                                  }
                                });

  function getFocusPointFromCurrentDimensions() {
    return ZERO;
  }

  return {
    dispose,
    getFocusPointFromCurrentDimensions
  };

  function dispose() {
    layoutingSubscription.dispose();
    firstLayoutDone = false;
  }
}
