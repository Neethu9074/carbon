import * as ro from 'reactive-observables';


export const tooltip$ = ro.create();

export function setTooltip(newScene) {
  tooltip$.emit(newScene);
}

export function clear() {
  tooltip$.emit(null);
}
