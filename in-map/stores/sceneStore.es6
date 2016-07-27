import {createStore} from 'in-stores/store';


const requestedFrame = createStore({
  name: 'scene/requestedFrame',
  initialValue: 0
});
export const requestedFrame$ = requestedFrame.observable;

export function requestFrame() {
  requestedFrame.applyStateMutation(frame => ++frame);
}


const scene = createStore({
  name: 'scene/scene',
  initialValue: null
});
export const scene$ = scene.observable;

export function setScene(newScene) {
  scene.applyStateMutation(() => newScene);
}

export function clearScene() {
  scene.applyStateMutation(() => null);
}
