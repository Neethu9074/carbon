import { combineLatest } from 'reactive-observables';
import RoEmitter from 'roemitter';

import { setShowSticky as showServiceSticky, setShowKpi as showServiceKpi } from 'in-map/stores/logical/servicesStore';
import { setShowSticky as showConnectionSticky } from 'in-map/stores/logical/connectionsStore';
import { setShowSticky as showGroupLabelSticky } from 'in-map/stores/physical/groupsStore';
import { setShowSticky as showNodesSticky } from 'in-map/stores/physical/nodesStore';
import { settings$ } from 'in-services/settings';

export let eventBus;

export function createEventBus() {
  if (eventBus) {
    eventBus.dispose();
  }

  eventBus = new RoEmitter('global event bus');

  combineLatest([eventBus.on('zoomLevelChanged'), settings$]).subscribe(([zoomLevel, settings]) => {
    const conncetionStickyMinDistance = settings['map_logical_service_kpi_distance'] || 150;

    showServiceKpi(zoomLevel < 420);

    showServiceSticky(zoomLevel < 600);
    showConnectionSticky(zoomLevel < conncetionStickyMinDistance);

    showGroupLabelSticky(zoomLevel < 550);

    showNodesSticky(zoomLevel < 250);

    showGroupLabelSticky(zoomLevel <= 600);
  });
}
