/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

export const activeDialogs$ = create().emit([]);

export function addActiveDialog(dialog) {
  activeDialogs$.once(dialogs => {
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
