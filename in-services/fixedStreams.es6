import {create} from 'reactive-observables';

import * as fixedImmutables from 'in-services/fixedImmutables';
import * as fixedObjects from 'in-services/fixedObjects';

export const alwaysNull = create().emit(null).freeze();
export const alwaysEmptyArray = create().emit(fixedObjects.emptyArray).freeze();
export const alwaysEmptyImmutableMap = create().emit(fixedImmutables.emptyMap).freeze();
