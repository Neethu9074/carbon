import * as ro from 'reactive-observables';


export const tooltip$ = ro.create();

export function setTooltip(objects) {
  tooltip$.emit(objects);
}

export function clear() {
  tooltip$.emit(null);
}
