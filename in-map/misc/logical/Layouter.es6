import {combineLatest} from 'reactive-observables';

import {nodePositions$, currentLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';
import {ZERO} from 'in-map/misc/fixedVectors';


export default function createLayouter() {
  let layoutingSubscription = combineLatest([
                                 services.stream,
                                 connections.stream,
                                 currentLayoutingStrategy$,
                                 nodePositions$
                               ])
                               .map(([_services, _connections, _currentLayoutingStrategy, _nodePositions]) => {
                                 return {
                                   nodes: Object.keys(_services.objects).map(key => _services.objects[key]),
                                   edges: Object.keys(_connections.objects).map(key => _connections.objects[key]),
                                   layoutStrategy: _currentLayoutingStrategy,
                                   nodePositions: _nodePositions
                                 };
                               })
                               .debounce(100)
                               .subscribe(({nodes, edges, layoutStrategy, nodePositions}) =>
                                  layoutStrategy(nodes, edges, nodePositions));


  function getFocusPointFromCurrentDimensions() {
    return ZERO;
  }

  return {
    dispose,
    getFocusPointFromCurrentDimensions
  };

  function dispose() {
    layoutingSubscription.dispose();
    layoutingSubscription = null;
  }
}
