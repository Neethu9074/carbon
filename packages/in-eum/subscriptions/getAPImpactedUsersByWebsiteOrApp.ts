/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  Result,
  CursorPaginatedResult,
  TimeConfig,
  CursorPagination,
  IngestionOffsetCursor,
  APImpactedUsersByWebsiteOrAppResultItem,
  GetAPImpactedUsersByWebsiteOrAppQuery,
  TagFilterExpressionElementUnion,
  JoinSource,
} from 'in-types';

// eslint-disable-next-line no-restricted-imports


import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetAPImpactedUsersByWebsiteOrAppQuery,
  Result<CursorPaginatedResult<APImpactedUsersByWebsiteOrAppResultItem>>
>({
  eventId: 'getAPImpactedUsersByWebsiteOrApp',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

type makeAPImpactedUsersByWebsiteOrAppQueryProp = {
  timeConfig: TimeConfig;
  pagination?: CursorPagination<IngestionOffsetCursor>;
  joinFilterExpression: TagFilterExpressionElementUnion,
  joinSource: JoinSource
};

export function makeAPImpactedUsersByWebsiteOrAppQuery({
  timeConfig,
  pagination,
  joinFilterExpression,
  joinSource
}: makeAPImpactedUsersByWebsiteOrAppQueryProp): GetAPImpactedUsersByWebsiteOrAppQuery {
  return {
    timeConfig,
    join: {
      source: joinSource,
      type: 'JOIN_TYPE_IN',
      metric: 'beaconByTrace.truncatedBackendTraceId',
      tagFilterExpression: joinFilterExpression
    },
    pagination: pagination || {
      cursor: undefined,
      retrievalSize: 15
    }
  };
}
