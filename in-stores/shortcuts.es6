import {createStore} from 'in-stores/store';

const shortcutsAreActive = createStore({
  name: 'shortcutsAreActiveStore',
  initialValue: true
});
export const shortcutsAreActive$ = shortcutsAreActive.observable;

export function disableShortcuts() {
  shortcutsAreActive.applyStateMutation(() => false);
}

export function enableShortcuts() {
  shortcutsAreActive.applyStateMutation(() => true);
}
