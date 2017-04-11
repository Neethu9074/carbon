import { combineLatest } from 'reactive-observables';

import { currentLayoutingStrategy$ } from 'in-map/stores/logical/layouterStore';
import { setTimeout, clearTimeout } from 'in-services/chronos';
import { LOGICAL_LAYOUTING } from 'in-map/misc/TimingConfig';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';

export default function createLayouter() {
  const layoutingSubscription = currentLayoutingStrategy$
    .flatMap(layouting$ =>
      combineLatest([services.stream, connections.stream, layouting$])
        .debounce(LOGICAL_LAYOUTING, { setTimeout, clearTimeout })
        .map(([_services, _connections, layoutStrategy]) => {
          const config = layoutStrategy.config;
          config.nodes = Object.keys(_services).map(key => _services[key]);
          config.edges = Object.keys(_connections).map(key => _connections[key]);
          return layoutStrategy;
        }))
    .subscribe(layoutStrategy => layoutStrategy.applyLayout(layoutStrategy.config));

  return {
    dispose
  };

  function dispose() {
    layoutingSubscription.dispose();
  }
}
