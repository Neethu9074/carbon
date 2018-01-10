import { combineLatest } from 'reactive-observables';

import { restoreInitialExpandedState } from 'in-views/eventView/stores/populationChartExpandedStore';
import { restoreInitialVisibilityState } from 'in-views/eventView/stores/changesVisibilityStore';
import { getEvent, selectedIncident$ } from 'in-stores/events';
import { emptyList } from 'in-services/fixedImmutables';
import { emptyArray } from 'in-services/fixedObjects';
import { createTrackingStore } from 'in-stores/store';
import { always } from 'in-services/fixedStreams';

export const sortedRecentEvents$ = createTrackingStore({
  name: 'eventView/recentEvents',
  observable: selectedIncident$.flatMap(incident => {
    restoreInitialVisibilityState();
    restoreInitialExpandedState();

    if (!incident) {
      return always(emptyArray);
    }

    return combineLatest(
      incident
        .get('recentEvents', emptyList)
        .toArray()
        .map(getEvent)
    ).map(ids =>
      ids.sort(
        (a, b) =>
          incident.getIn(['issueOrderMap', a.get('id')], a.get('start')) -
          incident.getIn(['issueOrderMap', b.get('id')], b.get('start'))
      )
    );
  })
}).observable;
