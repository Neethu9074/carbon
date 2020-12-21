import { create } from '@instana/observables';

export const breadcrumbs$ = create();

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbs$.emit(newBreadcrumbs);
}
