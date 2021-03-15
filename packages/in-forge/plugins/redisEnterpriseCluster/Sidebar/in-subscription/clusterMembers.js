/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Set } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getRedisEnterpriseNodesForCluster',

  transform(observable) {
    return observable.map(Set);
  }
});
