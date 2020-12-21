import { create } from '@instana/observables';

export const floatingActionButtons$ = create();

export function replaceFloatingActionButtons(newFloatingActionButtons) {
  floatingActionButtons$.emit(newFloatingActionButtons);
}
