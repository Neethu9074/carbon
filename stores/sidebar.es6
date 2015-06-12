'use strict';

import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const visibility = ro.create(roSpec);
visibility.emit(true);

export function setVisibility(visible) {
  visibility.emit(visible);
}
