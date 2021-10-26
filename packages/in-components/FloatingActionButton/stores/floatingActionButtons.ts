/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';

export const floatingActionButtons$ = create();

export function replaceFloatingActionButtons(newFloatingActionButtons: Observable<unknown>) {
  floatingActionButtons$.emit(newFloatingActionButtons);
}
