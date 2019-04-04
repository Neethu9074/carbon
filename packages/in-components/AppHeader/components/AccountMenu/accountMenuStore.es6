import { hideUsageInfo } from 'in-stores/usageInfo';
import { createStore } from 'in-stores/store';

const isOpen = createStore({
  name: 'isAccountMenuOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable;

export function toggleMenu() {
  isOpen.applyStateMutation(oldValue => !oldValue);
  hideUsageInfo();
}

export function closeMenu() {
  isOpen.applyStateMutation(() => false);
}
