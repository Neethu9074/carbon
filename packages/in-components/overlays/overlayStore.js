/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { emptyArray } from 'in-services/fixedObjects';
import { createStore } from 'in-stores/store';

const store = createStore({
  name: `in-components/overlays/Overlay`,
  isGlobal: false,
  initialValue: emptyArray
});

export const overlays$ = store.observable;

export function set(overlays) {
  store.mutateTo(overlays);
}
