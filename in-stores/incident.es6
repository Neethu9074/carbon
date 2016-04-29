import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import * as navigation from 'in-stores/navigation';
import {getEvent} from 'in-services/issueTracker';


const selectedIncidentStore = createStore({
  name: 'selectedIncidentIdToStore',
  initialValue: null
});

export const selectedIncident = createTrackingStore({
  name: 'selectedIncidentStore',
  observable: selectedIncidentStore.observable
                .distinct()
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
    navigation.goToMap();
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
