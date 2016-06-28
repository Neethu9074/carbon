import {createStore} from 'in-stores/store';

import {open, close} from 'in-components/Filterbar/stores/filterbarVisibilityStore';


const activeControl = createStore({
  name: 'filterbar/activeControlStore',
  initialValue: null
});
export const activeControl$ = activeControl.observable.distinct();

export function setActiveControl(control) {
  activeControl.applyStateMutation(() => control);
}

activeControl$.skipFirst().subscribe(_activeControl => _activeControl ? open() : close());
