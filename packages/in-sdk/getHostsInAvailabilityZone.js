/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getViewStructure } from 'in-stores/view/viewStructureStore';

export function getHostsInAvailabilityZone(zoneSnapshotId) {
  return getViewStructure().map(viewStructure => {
    const zoneChildren = viewStructure.viewStructure.children.find(child => child.id === zoneSnapshotId);
    return zoneChildren.children.filter(child => viewStructure.includedIds.hostIds[child.id]).map(child => child.id);
  });
}
