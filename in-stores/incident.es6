import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {getEvent} from 'in-services/issueTracker';


const selectedIncidentStore = createStore({
  name: 'selectedIncidentIdToStore',
  initialValue: null
});
const selectedIncidentId = selectedIncidentStore.observable.distinct();


export const selectedIncident = createTrackingStore({
  name: 'selectedIncidentStore',
  observable: selectedIncidentId.flatMap(incident => {
    if (incident && incident.id && incident.to) {
      return getEvent(incident.id, incident.to);
    }
    return alwaysNull;
  })
}).observable;

export function setSelectedIncidentId(id, to) {
  if (id == null) {
    clearSelectedIncidentId();
  } else {
    mutateUrl(navParams => {
      delete navParams.query.snapshotId;
      navParams.query.incidentId = encodeURIComponent(id);
      navParams.query.incidentTo = encodeURIComponent(to);
      return navParams;
    });
  }
}


export function clearSelectedIncidentId() {
  mutateUrl(navParams => {
    delete navParams.query.incidentId;
    delete navParams.query.incidentTo;
    return navParams;
  });
  selectedIncidentStore.applyStateMutation(() => null);
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('incidentId' in query) {
    const id = decodeURIComponent(query.incidentId);
    const to = decodeURIComponent(query.incidentTo);
    selectedIncidentStore.applyStateMutation(() => {
      return {
        id,
        to
      };
    });
  } else {
    selectedIncidentStore.applyStateMutation(() => null);
  }
});
