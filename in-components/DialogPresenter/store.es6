import {create} from 'reactive-observables';

// null or a react component
export const activeDialog$ = create().emit(null);

export function setActiveDialog(dialog) {
  activeDialog$.emit(dialog);
}

export function close() {
  activeDialog$.emit(null);
}
