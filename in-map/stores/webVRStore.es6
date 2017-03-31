import { createStore } from 'in-stores/store';

const isWebVRActiveStore = createStore({
  name: 'isWebVRActiveStoreStore',
  initialValue: false
});
export const isWebVRActive$ = isWebVRActiveStore.observable;

export let isWebVRActive;

export function webVRIsActive(_isActive) {
  isWebVRActiveStore.applyStateMutation(() => _isActive);
  isWebVRActive = _isActive;
}
