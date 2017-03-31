import { create } from 'reactive-observables';
import React from 'react';

import { getAllEumKeys, removeKey, addKey, renameKey } from 'in-services/groundskeeper/eumKeys';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { alwaysNull } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';

const refresh$ = create();

export const keys$ = createTrackingStore({
  name: 'configurationView/subview/EumKeys/stores/keys',
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

export function remove(keyId, name) {
  setActiveDialog(
    <ConfirmationDialog
      header="Confirm removal"
      description={
        <span>
          Are you sure you want to remove the app <strong>{name}</strong>?
        </span>
      }
      bButtonLabel="Remove app"
      onB={() => {
        close();
        removeKey(keyId).once(() => refresh$.emit(true));
      }}
    />
  );
}

export function add(appName) {
  addKey(appName).once(() => refresh$.emit(true));
}

export function rename(apiKey, newAppName, onSucess) {
  renameKey(apiKey, newAppName).once(response => {
    if (response && response.status === 200) {
      onSucess();
    }
    refresh$.emit(true);
  });
}
