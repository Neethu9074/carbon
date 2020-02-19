import { create } from 'reactive-observables';

const inMemoryMap = {};

export const getPinnedItems$ = create();
getPinnedItems$.emit(inMemoryMap);

export function pin(type, id) {
  if (!inMemoryMap[type]) {
    inMemoryMap[type] = [];
  }
  if (inMemoryMap[type].indexOf(id) === -1) {
    inMemoryMap[type].push(id);
    getPinnedItems$.emit(inMemoryMap);
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
  getPinnedItems$.emit(inMemoryMap);
}
