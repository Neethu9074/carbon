/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

export const breadcrumbs$ = create();

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbs$.emit(newBreadcrumbs);
}
