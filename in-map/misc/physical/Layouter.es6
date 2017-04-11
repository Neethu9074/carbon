import { combineLatest } from 'reactive-observables';

import { currentLayoutingStrategy$ } from 'in-map/stores/physical/layouterStore';
import { PHYSICAL_LAYOUTING } from 'in-map/misc/TimingConfig';
import { setTimeout, clearTimeout } from 'in-services/chronos';
import { groups } from 'in-map/stores/physical/groupsStore';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { eventBus } from 'in-map/services/eventBus';

export default function createLayouter() {
  const layoutingSubscription = currentLayoutingStrategy$
    .flatMap(layouting$ =>
      combineLatest([groups.stream, layouting$, nodes.stream, eventBus.on('layoutNeedsUpdate')])
        .debounce(PHYSICAL_LAYOUTING, { setTimeout, clearTimeout })
        .map(([_groups, layoutStrategy]) => {
          const config = layoutStrategy.config;
          config.groups = Object.keys(_groups).map(key => _groups[key]);
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
