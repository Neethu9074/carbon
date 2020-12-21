import { combineLatest } from '@instana/observables';

import { currentLayoutingStrategy$ } from 'in-map/stores/physical/layouterStore';
import { PHYSICAL_LAYOUTING } from 'in-map/misc/TimingConfig';
import { groups } from 'in-map/stores/physical/groupsStore';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { eventBus } from 'in-map/services/eventBus';

export default function createLayouter() {
  const layoutingSubscription = currentLayoutingStrategy$
    .flatMap(layouting$ =>
      combineLatest([groups.stream, layouting$, nodes.stream, eventBus.on('layoutNeedsUpdate')])
        .debounce(PHYSICAL_LAYOUTING)
        .map(([_groups, layoutStrategy]) => {
          layoutStrategy.config.groups = mapGroupsToArray(_groups);
          return layoutStrategy;
        })
    )
    .subscribe(layoutStrategy => layoutStrategy.applyLayout(layoutStrategy.config));

  return {
    dispose
  };

  function dispose() {
    layoutingSubscription.dispose();
  }
}

function mapGroupsToArray(_groups) {
  const groups = [];
  let groupIndex = 0;
  _groups.forEach(group => (groups[groupIndex++] = group));
  return groups;
}
