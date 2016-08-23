import {create} from 'reactive-observables';

import {emptyMap} from 'in-services/fixedImmutables';
import {emptyArray} from 'in-services/fixedObjects';

export const alwaysNull = create().emit(null).freeze();
export const alwaysFalse = create().emit(false).freeze();
export const alwaysTrue = create().emit(true).freeze();
export const alwaysEmptyArray = create().emit(emptyArray).freeze();
export const alwaysEmptyImmutableMap = create().emit(emptyMap).freeze();
