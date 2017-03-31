import { create } from 'reactive-observables';

export const tooltip$ = create();

export function setTooltip(objects) {
  tooltip$.emit(objects);
}

export function clear() {
  tooltip$.emit(null);
}
