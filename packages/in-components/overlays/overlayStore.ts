/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ReactNode } from 'react';

import { createStore } from 'in-stores/store';

const store = createStore<Array<ReactNode>>({
  name: `in-components/overlays/Overlay`,
  isGlobal: false,
  initialValue: []
});

export const overlays$ = store.observable;

export function set(overlays: ReactNode[]) {
  store.mutateTo(overlays);
}
