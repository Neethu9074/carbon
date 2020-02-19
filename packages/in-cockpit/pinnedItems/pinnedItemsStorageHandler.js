import { create } from 'reactive-observables';

import { deepCopy } from 'in-services/util/object';

let inMemoryMap = {};

export function clear() {
  inMemoryMap = {};
}

export const getPinnedItems$ = create();
getPinnedItems$.emit(inMemoryMap);

export function pin(type, id) {
  if (!inMemoryMap[type]) {
    inMemoryMap[type] = [];
  }
  if (inMemoryMap[type].indexOf(id) === -1) {
    inMemoryMap[type].push(id);
    emitMap();
  }
}

export function unpin(type, id) {
  if (!inMemoryMap[type]) {
    return;
  }
  const indexOfId = inMemoryMap[type].indexOf(id);
  if (indexOfId === -1) {
    return;
  }

  inMemoryMap[type].splice(indexOfId, 1);
  emitMap();
}

function emitMap() {
  getPinnedItems$.emit(deepCopy(inMemoryMap));
}
