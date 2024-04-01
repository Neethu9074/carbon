/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  GetMobileAppBeaconGroupsQuery,
  Result,
  CursorPaginatedResult,
  MobileAppBeaconGroupsItem
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetMobileAppBeaconGroupsQuery,
  Result<CursorPaginatedResult<MobileAppBeaconGroupsItem>>
>({
  eventId: 'getMobileAppBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
