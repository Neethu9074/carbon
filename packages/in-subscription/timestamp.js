/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'timestamp',

  getId({ originate }) {
    return originate;
  },

  // Disable memoization. This is actually a simple RPC call.
  memoizeFor: 0,

  getData(subscriptionId, { originate }) {
    return {
      subscriptionId,
      originate
    };
  }
});
