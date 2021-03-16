/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-is-monitoring',

  getId() {
    return 'isMonitoring';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});
