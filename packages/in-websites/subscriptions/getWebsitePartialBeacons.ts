/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, GetWebsiteBeaconsQuery, WebsitePartialBeaconsItem, CursorPaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteBeaconsQuery,
  Result<CursorPaginatedResult<WebsitePartialBeaconsItem>>
>({
  eventId: 'getWebsitePartialBeacons',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
