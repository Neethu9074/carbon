import Immutable from 'immutable';

import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';


const selectedIncidentIdStore = createStore({
  name: 'selectedIncidentIdStore',
  initialValue: null
});
export const selectedIncidentId = selectedIncidentIdStore.observable.distinct();


export const selectedIncident = createTrackingStore({
  name: 'selectedIncidentStore',
  observable: selectedIncidentId.map(id => {
    if (id) {
      return getSnapshot(id);
    }
    return null;
  })
}).observable;


function getSnapshot(id) {
  return Immutable.fromJS({
    id,
    key: '',
    start: '',
    end: '',
    state: '',
    metadata: '',
    issues: ''
  });
}


export function setSelectedIncidentId(id) {
  if (id == null) {
    clearSelectedIncidentId();
  } else {
    mutateUrl(navParams => {
      delete navParams.query.snapshotId;
      navParams.query.incidentId = encodeURIComponent(id);
      return navParams;
    });
  }
}

export function clearSelectedIncidentId() {
  mutateUrl(navParams => {
    delete navParams.query.incidentId;
    return navParams;
  });
}

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('incidentId' in query) {
    const incidentId = decodeURIComponent(query.incidentId);
    selectedIncidentIdStore.applyStateMutation(() => incidentId);
  } else {
    selectedIncidentIdStore.applyStateMutation(() => null);
  }
});
