import {create} from 'reactive-observables';

export const canvas$ = create();

export function setCanvas(newCanvas) {
  canvas$.emit(newCanvas);
}

export function clear() {
  canvas$.emit(null);
}
