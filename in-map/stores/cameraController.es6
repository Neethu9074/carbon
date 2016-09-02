import {create} from 'reactive-observables';

import {createStore} from 'in-stores/store';


export const cameraController$ = create();

export function setCameraController(controller) {
  cameraController$.emit(controller);
}


const cameraWasMovedByUserInteraction = createStore({
  name: 'in-map/cameraWasMovedByUserInteraction',
  initialValue: false
});
export const cameraWasMovedByUserInteraction$ = cameraWasMovedByUserInteraction.observable;

export function cameraWasMoved() {
  cameraWasMovedByUserInteraction.applyStateMutation(() => true);
}

export function clearCameraWasMoved() {
  cameraWasMovedByUserInteraction.applyStateMutation(() => false);
}
