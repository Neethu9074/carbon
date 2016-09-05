import {createStore} from 'in-stores/store';


const frame = createStore({
  name: 'scene/requestedFrame',
  initialValue: 1
});
export const frame$ = frame.observable;

export function requestRendering() {
  frame.applyStateMutation(oldFrame => ++oldFrame);
}

export function clear() {
  frame.applyStateMutation(() => 1);
}


const updatesEnabled = createStore({
  name: 'scene/updatesEnabled',
  initialValue: true
});
export const updatesEnabled$ = updatesEnabled.observable;

export function enableUpdates() {
  updatesEnabled.applyStateMutation(() => true);
}

export function disableUpdates() {
  updatesEnabled.applyStateMutation(() => false);
}
