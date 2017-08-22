import { create } from 'reactive-observables';

export const breadcrumbs$ = create();

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbs$.emit(newBreadcrumbs);
}
