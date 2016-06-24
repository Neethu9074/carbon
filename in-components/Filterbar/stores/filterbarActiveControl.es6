import {createStore} from 'in-stores/store';

import {openFilterbar, closeFilterbar} from 'in-components/Filterbar/stores/filterbarIsOpenStore';


const activeControl = createStore({
  name: 'filterbar/activeControlStore',
  initialValue: null
});
export const activeControl$ = activeControl.observable.distinct();

export function setActiveControl(control) {
  activeControl.applyStateMutation(() => control);
}

activeControl$.subscribe(_activeControl => _activeControl ? openFilterbar() : closeFilterbar());
