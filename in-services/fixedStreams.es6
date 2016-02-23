import * as ro from 'reactive-observables';

import * as fixedObjects from './fixedObjects';

export const alwaysNull = ro.create().emit(null).freeze();
export const alwaysEmptyArray = ro.create().emit(fixedObjects.emptyArray).freeze();
