import {create} from 'reactive-observables';

import {getAllEumKeys, removeKey, addKey, renameKey} from 'in-services/groundskeeper/eumKeys';
import {alwaysNull} from 'in-services/fixedStreams';
import {createTrackingStore} from 'in-stores/store';

const refresh$ = create();

export const keys$ = createTrackingStore({
  name: 'in-views/configurationView/subview/EumKeys/stores/keys',
  observable: refresh$
    .flatMap(doLoad => {
      if (!doLoad) {
        return alwaysNull;
      }

      return getAllEumKeys();
    })
    .distinct()
}).observable;


export function enable() {
  refresh$.emit(true);
}

export function disable() {
  refresh$.emit(false);
}

export function remove(keyId) {
  removeKey(keyId)
    .once(() => refresh$.emit(true));
}

export function add(appName) {
  addKey(appName)
    .once(() => refresh$.emit(true));
}

export function rename(apiKey, newAppName) {
  renameKey(apiKey, newAppName)
    .once(() => refresh$.emit(true));
}
