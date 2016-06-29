import {clearActiveControl} from 'in-components/RightSidebar/stores/rightSidebarActiveControlStore';
import {createStore} from 'in-stores/store';


const isOpen = createStore({
  name: 'isAccountMenuOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable;

export function toggleMenu() {
  isOpen.applyStateMutation(oldValue => {
    if (!oldValue) {
      clearActiveControl();
    }
    return !oldValue;
  });
}

export function closeMenu() {
  isOpen.applyStateMutation(() => false);
}
