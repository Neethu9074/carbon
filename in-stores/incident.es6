import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import * as navigation from 'in-stores/navigation';
import {getEvent} from 'in-services/issueTracker';


const selectedIncidentIdAndTo$ = createTrackingStore({
  name: 'selectedIncidentIdAndTo',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('incidentId' in query) {
        return {
          id: decodeURIComponent(query.incidentId),
          to: decodeURIComponent(query.incidentTo)
        };
      }

      return null;
    })
    .distinct()
}).observable;


export const selectedIncidentId$ = selectedIncidentIdAndTo$
  .map(incident => incident ? incident.id : null)
  .distinct();


export const selectedIncident$ = createTrackingStore({
  name: 'selectedIncident',
  observable: selectedIncidentIdAndTo$
    .flatMap(incident => {
      if (incident && incident.id && incident.to) {
        return getEvent(incident.id, incident.to);
      }
      return alwaysNull;
    })
}).observable;


export function setSelectedIncident(id, to) {
  if (id == null) {
    clearSelectedIncident();
  } else {
    navigation.goToRootOfView();
    mutateUrl(navParams => {
      delete navParams.query.snapshotId;
      navParams.query.incidentId = encodeURIComponent(id);
      navParams.query.incidentTo = encodeURIComponent(to);
      return navParams;
    });
  }
}


export function clearSelectedIncident() {
  mutateUrl(navParams => {
    delete navParams.query.incidentId;
    delete navParams.query.incidentTo;
    return navParams;
  });
}
