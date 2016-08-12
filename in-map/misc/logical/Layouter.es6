/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import {currentLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';
import {eventBus} from 'in-map/services/eventBus';
import {ZERO} from 'in-map/misc/fixedVectors';


export default function createLayouter() {
  let shouldReset = false;
  let currentLayoutingStrategy;

  let layoutingSubscription = combineLatest([
                                 services.stream,
                                 connections.stream,
                                 currentLayoutingStrategy$,
                                 eventBus.on('resetProcessViewLayouting')
                               ])
                               .map(([_services, _connections, _currentLayoutingStrategy]) => {
                                 return {
                                   nodes: Object.keys(_services.objects).map(key => _services.objects[key]),
                                   edges: Object.keys(_connections.objects).map(key => _connections.objects[key]),
                                   layoutStrategy: _currentLayoutingStrategy
                                 };
                               })
                               .debounce(100)
                               .subscribe(({nodes, edges, layoutStrategy}) => {
                                 if (shouldReset || currentLayoutingStrategy !== layoutStrategy) {
                                   nodes.forEach(node => node._wasAutomaticLayouted = false);
                                   shouldReset = false;
                                 }

                                 currentLayoutingStrategy = layoutStrategy;
                                 currentLayoutingStrategy(nodes, edges);
                               });

  let resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(_shouldReset => {
    if (_shouldReset) {
      shouldReset = true;
      eventBus.emit('resetProcessViewLayouting', false);
    }
  });

  let currentLayoutingStrategySubscription = currentLayoutingStrategy$.distinct().subscribe(() =>
    eventBus.emit('resetProcessViewLayouting', true));

  eventBus.emit('resetProcessViewLayouting', true);


  function getFocusPointFromCurrentDimensions() {
    return ZERO;
  }

  return {
    dispose,
    getFocusPointFromCurrentDimensions
  };

  function dispose() {
    currentLayoutingStrategySubscription.dispose();
    currentLayoutingStrategySubscription = null;

    resetProcessViewLayoutingSubscription.dispose();
    resetProcessViewLayoutingSubscription = null;

    layoutingSubscription.dispose();
    layoutingSubscription = null;

    currentLayoutingStrategy = null;
    shouldReset = null;
  }
}
