import * as ro from 'reactive-observables';

export const alwaysNull = ro.create().emit(null).freeze();
export const alwaysEmptyArray = ro.create().emit(freeze([])).freeze();

function freeze(v) {
  Object.freeze(v);
  return v;
}
