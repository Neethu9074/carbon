import { create } from 'reactive-observables';

export const activeDialogs$ = create().emit([]);

export function setActiveDialog(dialog) {
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
