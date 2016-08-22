import * as ro from 'reactive-observables';


export const cameraController$ = ro.create();

export function setCameraController(controller) {
  cameraController$.emit(controller);
}
