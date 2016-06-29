import {createStore} from 'in-stores/store';

import {toggleTableViewVisibility} from 'in-components/tableView/stores/visibility';


export const CONTROL_TYPES = {
  MAP_STATISTICS: 'system',
  NOTIFICATIONS: 'app',
  METRICS: 'metrics',
  TABLE: 'menue',
  TAGS: 'tags'
};


const activeControl = createStore({
  name: 'rightSidebar/activeControlStore',
  initialValue: null
});
export const activeControl$ = activeControl.observable.distinct();

export function setActiveControl(control) {
  activeControl.applyStateMutation(() => control);
}

export function toggleControl(control) {
  if (control === CONTROL_TYPES.TABLE) {
    toggleTableViewVisibility();
  } else {
    activeControl$.once(currentControls => currentControls === control ?
      clearActiveControl() :
      setActiveControl(control));
  }
}

export function clearActiveControl() {
  setActiveControl(null);
}
