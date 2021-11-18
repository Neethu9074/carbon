/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getViewStructure } from 'in-infrastructure/perspectives/viewStructureStore';
import { emptyArray } from 'in-services/fixedObjects';

export function getItemsInAvailabilityZone(zoneSnapshotId) {
  return getViewStructure().map(viewStructure => {
    const zoneChildren = viewStructure.viewStructure.children.find(child => child.id === zoneSnapshotId);
    if (!zoneChildren) {
      return emptyArray;
    }
    return zoneChildren.children.filter(child => viewStructure.includedIds.hostIds[child.id]).map(child => child.id);
  });
}
