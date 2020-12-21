import RoEmitter from '@instana/roemitter';

import { setShowSticky as showGroupLabelSticky } from 'in-map/stores/physical/groupsStore';
import { setShowSticky as showNodesSticky } from 'in-map/stores/physical/nodesStore';

export let eventBus;

export function createEventBus() {
  if (eventBus) {
    eventBus.dispose();
  }

  eventBus = new RoEmitter('global event bus');

  eventBus.on('zoomLevelChanged').subscribe(zoomLevel => {
    showGroupLabelSticky(zoomLevel < 550);

    showNodesSticky(zoomLevel < 250);

    showGroupLabelSticky(zoomLevel <= 600);
  });
}
