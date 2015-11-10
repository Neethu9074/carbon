import create from './abstractSelectableSnapshotStore';
import {mutateUrl, navigationParameters} from './navigation';
import {extractCoordinates} from '../snapshots';

const store = create('selected snapshot');

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
