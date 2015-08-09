

import * as ro from 'reactive-observables';

export const level = {
  nearest: 0,
  near: 1,
  mid: 2
};

const reemitSpec = {emitLatestOnSubscribe: true};

export const zoomLevel = ro.create(reemitSpec);

// zoomLevel.emit(level.near);
