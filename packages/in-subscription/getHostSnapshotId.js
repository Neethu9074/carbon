/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generateStableHash } from '@instana/utils';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-host-snapshot-id',

  getId(snapshot) {
    return generateStableHash(snapshot.get('entityId').toJS());
  },

  getData(subscriptionId, snapshot) {
    return {
      subscriptionId,
      entityId: snapshot.get('entityId').toJS()
    };
  }
});
