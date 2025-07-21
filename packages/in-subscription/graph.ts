/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig } from '@instana/types';

import createSubscription from 'in-subscription/subscription';

export interface GraphRequest {
  timeConfig: TimeConfig;
  snapshotId?: string;
}

export default createSubscription({
  eventId: 'subscribe-graph',

  getData(subscriptionId: number, { timeConfig, snapshotId }: GraphRequest) {
    return {
      subscriptionId,
      timeConfig,
      snapshotId
    };
  }
});
