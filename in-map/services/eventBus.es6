import RoEmitter from 'roemitter';

import {
  setShowSticky as showConnectionSticky
} from 'in-map/stores/logical/connectionsStore';
import {
  setShowSticky as showServiceSticky,
  setShowKpi as showServiceKpi
} from 'in-map/stores/logical/servicesStore';
import {setShowSticky as showGroupLabelSticky} from 'in-map/stores/physical/groupsStore';


export let eventBus;

export function createEventBus() {
  if (eventBus) {
    eventBus.dispose();
  }

  eventBus = new RoEmitter('global event bus');

  eventBus.on('zoomLevelChanged').subscribe(zoomLevel => {
    showServiceKpi(zoomLevel < 420);

    showServiceSticky(zoomLevel < 600);
    showConnectionSticky(zoomLevel < 150);

    showGroupLabelSticky(zoomLevel < 550);
  });
}
