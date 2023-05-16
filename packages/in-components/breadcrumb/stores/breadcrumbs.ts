/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Subject } from '@instana/observables';

export type Breadcrumb = React.ReactNode;

export const breadcrumbs$: Subject<Breadcrumb[]> = create();

export function replaceBreadcrumbs(newBreadcrumbs: Breadcrumb[]): void {
  breadcrumbs$.emit(newBreadcrumbs);
}
