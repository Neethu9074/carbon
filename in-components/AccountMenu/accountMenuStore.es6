import {close as closeNotificationFlyout} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';
import {createStore} from 'in-stores/store';


const isOpen = createStore({
  name: 'isAccountMenuOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable;

export function toggleMenu() {
  isOpen.applyStateMutation(oldValue => {
    if (!oldValue) {
      closeNotificationFlyout();
    }
    return !oldValue;
  });
}

export function closeMenu() {
  isOpen.applyStateMutation(() => false);
}
