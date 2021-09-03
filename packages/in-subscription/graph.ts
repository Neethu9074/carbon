/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createSubscription from 'in-subscription/subscription';
import { TimeConfig } from 'in-types';

export default createSubscription({
  eventId: 'subscribe-graph',

  getData(subscriptionId: number, timeConfig: TimeConfig) {
    return {
      subscriptionId,
      timeConfig
    };
  }
});
