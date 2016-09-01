import {createStore} from 'in-stores/store';


export const CONTROL_TYPES = {
  NOTIFICATIONS: 'incidents'
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
  activeControl$.once(currentControls => currentControls === control
    ? clearActiveControl()
    : setActiveControl(control));
}

export function clearActiveControl() {
  setActiveControl(null);
}
