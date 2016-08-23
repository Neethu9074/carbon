import {create} from 'reactive-observables';


export const cameraController$ = create();

export function setCameraController(controller) {
  cameraController$.emit(controller);
}
