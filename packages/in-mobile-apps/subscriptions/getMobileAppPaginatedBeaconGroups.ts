/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  GetMobileAppPaginatedBeaconGroupsQuery,
  MobileAppBeaconTagGroup,
  Result,
  PaginatedResult,
  MobileAppPaginatedBeaconGroupsItem
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface Query extends Omit<GetMobileAppPaginatedBeaconGroupsQuery, 'group' | 'timeShift'> {
  // Overwriting the backend definition here, because it is incorrectly generated. The groupbyEntity field will always be read as null upon deserialization in the backend, but is a required field in the generated ts.
  // See: https://github.ibm.com/instana/backend/blob/develop/ui-model/src/main/java/com/instana/ui/model/mobileappmonitoring/query/MobileAppBeaconTagGroup.java#L18
  group: Omit<MobileAppBeaconTagGroup, 'groupbyTagEntity'>;
}

export default createResultSubscriptionFactory<Query, Result<PaginatedResult<MobileAppPaginatedBeaconGroupsItem>>>({
  eventId: 'getMobileAppPaginatedBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
