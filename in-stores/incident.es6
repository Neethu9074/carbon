import createSnapshotObservable from 'in-services/subscription/event';
import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';


const selectedIncidentIdStore = createStore({
  name: 'selectedIncidentIdStore',
  initialValue: null
});
const selectedIncidentId = selectedIncidentIdStore.observable.distinct();


export const selectedIncident = createTrackingStore({
  name: 'selectedIncidentStore',
  observable: selectedIncidentId.flatMap(id => {
    if (id) {
      return getEvent(id);
    }
    return alwaysNull;
  })
}).observable;

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
  selectedIncidentIdStore.applyStateMutation(() => null);
}


export function getEvent(id) {
  return createSnapshotObservable(id);
}


navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('incidentId' in query) {
    const id = decodeURIComponent(query.incidentId);
    selectedIncidentIdStore.applyStateMutation(() => id);
  } else {
    selectedIncidentIdStore.applyStateMutation(() => null);
  }
});
