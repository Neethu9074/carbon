/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetMobileAppEnuSessionsQuery, Result, CursorPaginatedResult, MobileAppBeaconGroupsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppEnuSessionsQuery,
  Result<CursorPaginatedResult<MobileAppBeaconGroupsItem>>
>({
  eventId: 'getMobileAppEnuSessions',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
