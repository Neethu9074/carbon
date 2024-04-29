/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppBeaconsQuery, Result, CursorPaginatedResult, MobileAppBeaconsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppBeaconsQuery,
  Result<CursorPaginatedResult<MobileAppBeaconsItem>>
>({
  eventId: 'getMobileAppBeacons',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
