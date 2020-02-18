import { create } from 'reactive-observables';

const inMemoryMap = {};

export const favItems$ = create();
favItems$.emit(inMemoryMap);

export function set(type, id) {
  if (!inMemoryMap[type]) {
    inMemoryMap[type] = [];
  }
  if (inMemoryMap[type].indexOf(id) === -1) {
    inMemoryMap[type].push(id);
    favItems$.emit(inMemoryMap);
  }
}

export function unset(type, id) {
  if (!inMemoryMap[type]) {
    return;
  }
  const indexOfId = inMemoryMap[type].indexOf(id);
  if (indexOfId === -1) {
    return;
  }

  inMemoryMap[type].splice(indexOfId, 1);
  favItems$.emit(inMemoryMap);
}
