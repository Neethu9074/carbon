import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import {createStore} from 'in-stores/store';

import create from './abstractSelectableSnapshotStore';
import {extractCoordinates} from '../snapshots';

const selectedEntityIdStore = createStore({name: 'selected entity id'});
const store = create('selected snapshot');

export const selectedEntityId = selectedEntityIdStore.observable;
export const selectedSnapshotCoords = store.coordinates;
export const selectedSnapshot = store.fullSnapshot;

navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('sPluginId' in query && 'sHostId' in query && 'sSteadyId' in query) {
    const pluginId = decodeURIComponent(query.sPluginId);
    const hostId = decodeURIComponent(query.sHostId);
    const steadyId = decodeURIComponent(query.sSteadyId);
    store.select(extractCoordinates({pluginId, hostId, steadyId}));
  } else {
    store.clear();
  }
});


export function select(coords) {
  if (coords == null) {
    clear();
  } else {
    mutateUrl(navParams => {
      navParams.query.sPluginId = encodeURIComponent(coords.get('pluginId'));
      navParams.query.sHostId = encodeURIComponent(coords.get('hostId'));
      navParams.query.sSteadyId = encodeURIComponent(coords.get('steadyId'));
      return navParams;
    });
  }
}


export function clear() {
  mutateUrl(navParams => {
    delete navParams.query.sPluginId;
    delete navParams.query.sHostId;
    delete navParams.query.sSteadyId;
    return navParams;
  });
}

export function setSelectedEntityId(id) {
  selectedEntityIdStore.applyStateMutation(() => id);
}

export function clearSelectedEntityId() {
  selectedEntityIdStore.applyStateMutation(() => null);
}
