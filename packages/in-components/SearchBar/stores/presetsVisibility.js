import { createStore } from 'in-stores/store';

const visibilityStore = createStore({
  name: 'SearchBar/stores/presetsVisibility',
  initialValue: false
});

export const presetsVisible$ = visibilityStore.observable;

export function togglePresets() {
  visibilityStore.applyStateMutation(visible => !visible);
}
