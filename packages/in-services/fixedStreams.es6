import { create, just } from 'reactive-observables';

import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import { emptyArray } from 'in-services/fixedObjects';

export const nothing = create().freeze();
export const alwaysNull = just(null);
export const alwaysFalse = just(false);
export const alwaysTrue = just(true);
export const alwaysEmptyArray = just(emptyArray);
export const alwaysEmptyImmutableMap = just(emptyMap);
export const alwaysEmptyImmutableList = just(emptyList);

export const always = just;
