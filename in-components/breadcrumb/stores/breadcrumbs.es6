import { create } from 'reactive-observables';
import React from 'react';

import BreadcrumbForSnapshot from 'in-components/breadcrumb/BreadcrumbForSnapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot/snapshot';
import { getSnapshots } from 'in-stores/snapshot';

export const breadcrumbs$ = create();

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbs$.emit(newBreadcrumbs);
}

export function getPhysicalHierarchyBreadcrumbChain$(snapshotId) {
  return getPhysicalHierarchy(snapshotId)
    .flatMap(getSnapshots)
    .map(snapshots => snapshots.reverse().map(snapshot => <BreadcrumbForSnapshot snapshot={snapshot} />));
}
