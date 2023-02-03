/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generateStableHash } from '@instana/utils';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-was-server-snapshot-id',

  getId({ pid, hostSnapshot }) {
    return pid + generateStableHash(hostSnapshot.get('entityId').toJS());
  },

  getData(subscriptionId, { pid, hostSnapshot }) {
    return {
      subscriptionId,
      pid: String(pid),
      entityId: hostSnapshot.get('entityId').toJS()
    };
  }
});
