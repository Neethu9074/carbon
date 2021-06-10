/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

export const floatingActionButtons$ = create();

export function replaceFloatingActionButtons(newFloatingActionButtons) {
  floatingActionButtons$.emit(newFloatingActionButtons);
}
