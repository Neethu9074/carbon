import {closeMenu as closeAccountMenu} from 'in-components/AccountMenu/accountMenuStore';
import {selectedEventId$} from 'in-stores/events';
import {createStore} from 'in-stores/store';


const isOpen = createStore({
  name: 'isNotificationFlyoutOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable;

export function toggleMenu() {
  isOpen.applyStateMutation(oldValue => {
    if (!oldValue) {
      closeAccountMenu();
    }
    return !oldValue;
  });
}

export function closeMenu() {
  isOpen.applyStateMutation(() => false);
}

export function openMenu() {
  isOpen.applyStateMutation(() => true);
}

export function init() {
  selectedEventId$.subscribe(id => {
    if (id) {
      openMenu();
    }
  });
}
