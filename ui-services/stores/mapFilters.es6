'use strict';

import Immutable from 'immutable';
import * as ro from 'reactive-observables';

const emptyList = Immutable.List();
const reemitSpec = {emitLatestOnSubscribe: true};

// value in milliseconds
export const filters = ro.create(reemitSpec);
filters.emit(emptyList);

export function set(t) {
  filters.emit(t);
}

export function clear() {
  filters.emit(emptyList);
}
