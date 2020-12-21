import { create } from '@instana/observables';

export const tooltip$ = create();

export function setTooltip(object) {
  tooltip$.emit(object);
}

export function clear() {
  tooltip$.emit(null);
}
