import {combineLatest} from 'reactive-observables';

import {restoreInitialExpandedState} from 'in-components/eventView/stores/populationChartExpandedStore';
import {restoreInitialVisibilityState} from 'in-components/eventView/stores/changesVisibilityStore';
import {emptyList} from 'in-services/fixedImmutables';
import {emptyArray} from 'in-services/fixedObjects';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {selectedIncident$} from 'in-stores/events';
import {getEvent} from 'in-services/issueTracker';


export const recentEvents$ = createTrackingStore({
  name: 'eventView/recentEvents',
  observable: selectedIncident$.flatMap(incident => {
    restoreInitialVisibilityState();
    restoreInitialExpandedState();

    const recentEvents = incident
      ? incident.get('recentEvents', emptyList)
      : null;
    return recentEvents
     ? combineLatest(recentEvents.toArray().map(id => getEvent(id)))
     : alwaysNull;
  })
}).observable;

export const sortedRecentEvents$ = recentEvents$.map(events =>
  events ? events.slice().sort((a, b) => a.get('start') - b.get('start')) : emptyArray);
