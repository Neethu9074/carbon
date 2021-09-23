/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Set } from 'immutable';

import createSubscription from 'in-subscription/subscription';
import { timeConfig$ } from 'in-stores/time/config';

export function getClusterMembers(snapshotId) {
  return timeConfig$.flatMap(timeConfig =>
    subscribe({
      snapshotId,
      timeConfig
    })
  );
}

const subscribe = createSubscription({
  eventId: 'getRedisEnterpriseNodesForCluster',

  transform(observable) {
    return observable.map(Set);
  }
});
