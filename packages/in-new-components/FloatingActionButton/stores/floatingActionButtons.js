import { create } from 'reactive-observables';

export const floatingActionButtons$ = create();

export function replaceFloatingActionButtons(newFloatingActionButtons) {
  floatingActionButtons$.emit(newFloatingActionButtons);
}
