import {createStore} from 'in-stores/store';

import {setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';


const isOpen = createStore({
  name: 'filterbar/visibilityStore',
  initialValue: true
});
export const isOpen$ = isOpen.observable.distinct();

export function close() {
  isOpen.applyStateMutation(() => false);
  setActiveControl(null);
}

export function open() {
  isOpen.applyStateMutation(() => true);
}
