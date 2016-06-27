import {createStore} from 'in-stores/store';

import {setActiveControl} from 'in-components/Filterbar/stores/filterbarActiveControl';


const isOpen = createStore({
  name: 'filterbar/isOpenStore',
  initialValue: false
});
export const isOpen$ = isOpen.observable.distinct();

export function closeFilterbar() {
  isOpen.applyStateMutation(() => false);
  setActiveControl(null);
}

export function openFilterbar() {
  isOpen.applyStateMutation(() => true);
}
