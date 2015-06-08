'use strict';

import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const visibility = ro.create(roSpec);

export function setVisibility(visible) {
  visibility.emit(visible);
}
