/* eslint-disable complexity */
import {combineLatest} from 'reactive-observables';

import {currentLayoutingStrategy$} from 'in-map/stores/logical/layouterStore';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';
import {eventBus} from 'in-map/services/eventBus';


export default function createLayouter() {
  let shouldReset = false;
  let currentLayoutingStrategy;

  const layoutingSubscription = combineLatest([
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

  const resetProcessViewLayoutingSubscription = eventBus.on('resetProcessViewLayouting').subscribe(_shouldReset => {
    if (_shouldReset) {
      shouldReset = true;
      eventBus.emit('resetProcessViewLayouting', false);
    }
  });

  const currentLayoutingStrategySubscription = currentLayoutingStrategy$.distinct().subscribe(() =>
    eventBus.emit('resetProcessViewLayouting', true));

  eventBus.emit('resetProcessViewLayouting', true);

  return {
    dispose
  };

  function dispose() {
    currentLayoutingStrategySubscription.dispose();
    resetProcessViewLayoutingSubscription.dispose();
    layoutingSubscription.dispose();
  }
}
