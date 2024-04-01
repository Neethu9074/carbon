/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppBeaconsForSessionQuery, Result, MobileAppMonitoringBeacon } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetMobileAppBeaconsForSessionQuery, Result<MobileAppMonitoringBeacon[]>>(
  {
    eventId: 'getMobileAppBeaconsForSession',
    disposeSubscriptionOnDocumentHidden: false,
    trackSubscriptionStatistics: true
  }
);
