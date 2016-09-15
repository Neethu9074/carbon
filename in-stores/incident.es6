import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {goToRootOfView} from 'in-stores/navigation';
import {getEvent} from 'in-services/issueTracker';


export const selectedIncidentId$ = createTrackingStore({
  name: 'selectedIncidentId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('incidentId' in query) {
        return decodeURIComponent(query.incidentId);
      }

      return null;
    })
    .distinct()
}).observable;


export const selectedIncident$ = createTrackingStore({
  name: 'selectedIncident',
  observable: selectedIncidentId$.flatMap(id => id ? getEvent(id) : alwaysNull)
}).observable;


export function setSelectedIncident(id) {
  if (id == null) {
    clearSelectedIncident();
  } else {
    goToRootOfView();
    mutateUrl(navParams => {
      delete navParams.query.snapshotId;
      navParams.query.incidentId = encodeURIComponent(id);
      return navParams;
    });
  }
}


export function clearSelectedIncident() {
  mutateUrl(navParams => {
    delete navParams.query.incidentId;
    return navParams;
  });
}
