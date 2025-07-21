/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  CursorPaginatedResult,
  GetWebsiteBeaconGroupsQuery,
  Result,
  TimeShift,
  WebsiteBeaconGroupsItem,
  WebsiteBeaconTagGroup
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface Query extends Omit<GetWebsiteBeaconGroupsQuery, 'group' | 'timeShift'> {
  // Overwriting the backend definition here, because it is incorrectly generated. The groupbyEntity field will always be read as null upon deserialization in the backend, but is a required field in the generated ts.
  // See: https://github.ibm.com/instana/backend/blob/develop/ui-model/src/main/java/com/instana/ui/model/websitemonitoring/query/WebsiteBeaconTagGroup.java#L17
  group: Omit<WebsiteBeaconTagGroup, 'groupbyTagEntity'>;
  // TimeShift is optional via GetWebsiteBeaconGroupsQuery's constructor, See: https://github.ibm.com/instana/backend/blob/develop/ui-model/src/main/java/com/instana/ui/model/websitemonitoring/query/getWebsiteBeaconGroups/GetWebsiteBeaconGroupsQuery.java#L100
  timeShift?: TimeShift;
}

export default createResultSubscriptionFactory<Query, Result<CursorPaginatedResult<WebsiteBeaconGroupsItem>>>({
  eventId: 'getWebsiteBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
