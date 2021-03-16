/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createClusterMembersObservable from 'in-subscription/clusterMembers';
import { timeConfig$ } from 'in-stores/time/config';

export function getClusterMembers(snapshotId) {
  return timeConfig$.flatMap(timeConfig =>
    createClusterMembersObservable({
      snapshotId,
      timeConfig
    })
  );
}
