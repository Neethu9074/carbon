import {createStore} from 'in-stores/store';


const isOpen = createStore({
  name: 'rightSidebar/visibilityStore',
  initialValue: true
});
export const isOpen$ = isOpen.observable;

export function toggle() {
  isOpen.applyStateMutation(oldValue => !oldValue);
}

export function close() {
  isOpen.applyStateMutation(() => false);
}

export function open() {
  isOpen.applyStateMutation(() => true);
}
