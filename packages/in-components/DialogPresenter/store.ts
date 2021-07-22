/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Subject } from '@instana/observables';
import React from 'react';

export const activeDialogs$: Subject<any> = create().emit([]);

export function addActiveDialog(dialog: React.ReactNode) {
  activeDialogs$.once((dialogs: React.ReactNode[]) => {
    dialogs = dialogs.slice();
    dialogs.push(dialog);
    activeDialogs$.emit(dialogs);
  });
}

export function close() {
  activeDialogs$.once(dialogs => {
    dialogs = dialogs.slice();
    dialogs.pop();
    activeDialogs$.emit(dialogs ? dialogs : []);
  });
}
