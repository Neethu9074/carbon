import { createStore } from 'in-stores/store';

const visibilityStore = createStore({
  name: 'in-components/DeveloperPanel/stores/visibilityStore',
  initialValue: true
});

export const devPanelVisible$ = visibilityStore.observable;

export function toggleDevPanel() {
  visibilityStore.applyStateMutation(visible => !visible);
}
