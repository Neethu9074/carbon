import {create} from 'reactive-observables';

import * as fixedImmutables from 'in-services/fixedImmutables';
import * as fixedObjects from 'in-services/fixedObjects';

export const alwaysNull = create().emit(null).freeze();
export const alwaysFalse = create().emit(false).freeze();
export const alwaysTrue = create().emit(true).freeze();
export const alwaysEmptyArray = create().emit(fixedObjects.emptyArray).freeze();
export const alwaysEmptyImmutableMap = create().emit(fixedImmutables.emptyMap).freeze();
