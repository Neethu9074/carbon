import {create} from 'reactive-observables';

import {emptyMap} from 'in-services/fixedImmutables';
import {emptyArray} from 'in-services/fixedObjects';

export const alwaysNull = always(null);
export const alwaysFalse = always(false);
export const alwaysTrue = always(true);
export const alwaysEmptyArray = always(emptyArray);
export const alwaysEmptyImmutableMap = always(emptyMap);

export function always(v) {
  return create().emit(v).freeze();
}
