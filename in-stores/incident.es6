import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore} from 'in-stores/store';


const selectedIncidentStore = createStore({
  name: 'selectedIncidentStore',
  initialValue: null
});
export const selectedIncident = selectedIncidentStore.observable.distinct();


export function setSelectedIncident(incident) {
  if (incident == null) {
    clearSelectedIncident();
  } else {
    mutateUrl(navParams => {
      delete navParams.query.snapshotId;
      navParams.query.incidentId = encodeURIComponent(incident.get('id'));
      return navParams;
    });
    selectedIncidentStore.applyStateMutation(() => incident);
  }
}

export function clearSelectedIncident() {
  mutateUrl(navParams => {
    delete navParams.query.incidentId;
    return navParams;
  });
  selectedIncidentStore.applyStateMutation(() => null);
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if (!('incidentId' in query)) {
    selectedIncidentStore.applyStateMutation(() => null);
  }
});
