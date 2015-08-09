

import * as ro from 'reactive-observables';

const reemitSpec = {emitLatestOnSubscribe: true};

// value in milliseconds
export const timeframe = ro.create(reemitSpec);
timeframe.emit(1000 * 60 * 10);

// a timestamp as a number
export const focusedMoment = ro.create(reemitSpec);
focusedMoment.emit(null);

export function setFocusedMoment(t) {
  focusedMoment.emit(t);
}

export function clearFocusedMoment() {
  focusedMoment.emit(null);
}
