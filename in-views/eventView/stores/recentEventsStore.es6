import { combineLatest } from 'reactive-observables';

import { restoreInitialExpandedState } from 'in-views/eventView/stores/populationChartExpandedStore';
import { restoreInitialVisibilityState } from 'in-views/eventView/stores/changesVisibilityStore';
import { selectedIncident$, selectedObjective$ } from 'in-stores/events';
import { emptyList } from 'in-services/fixedImmutables';
import { emptyArray } from 'in-services/fixedObjects';
import { createTrackingStore } from 'in-stores/store';
import { alwaysNull } from 'in-services/fixedStreams';
import { getEvent } from 'in-services/issueTracker';

export const recentEvents$ = createTrackingStore({
  name: 'eventView/recentEvents',
  observable: combineLatest([selectedIncident$, selectedObjective$]).flatMap(([incident, objective]) => {
    restoreInitialVisibilityState();
    restoreInitialExpandedState();

    let eventIds = null;
    if (incident) {
      eventIds = incident.get('recentEvents', emptyList);
    } else if (objective) {
      eventIds = objective.get('issues', emptyList);
    }
    return eventIds ? combineLatest(eventIds.toArray().map(id => getEvent(id))) : alwaysNull;
  })
}).observable;

export const sortedRecentEvents$ = recentEvents$.map(
  events => (events ? events.slice().sort((a, b) => a.get('start') - b.get('start')) : emptyArray)
);
