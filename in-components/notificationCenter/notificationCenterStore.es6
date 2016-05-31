import {createStore} from 'in-stores/store';


const isOpen = createStore({
  name: 'isNotificationFlyoutOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable;

export function toggleMenu() {
  isOpen.applyStateMutation(oldValue => !oldValue);
}
