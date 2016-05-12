import * as ro from 'reactive-observables';

import * as fixedObjects from 'in-services/fixedObjects';

export const alwaysNull = ro.create().emit(null).freeze();
export const alwaysEmptyArray = ro.create().emit(fixedObjects.emptyArray).freeze();

export function always(val) {
  return ro.create().emit(val).freeze();
}
