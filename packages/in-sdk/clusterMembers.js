/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import getClusterMembersObservable from 'in-infrastructure/subscriptions/getClusterMembers';
import { timeConfig$ } from 'in-stores/time/config';

export function getClusterMembers(snapshotId) {
  return timeConfig$.flatMap(timeConfig =>
    getClusterMembersObservable({
      snapshotId,
      timeConfig
    })
  );
}
