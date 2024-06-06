/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Result,
  GetEumBeaconByTraceQuery,
  CursorPaginatedResult,
  EumBeaconByTraceBeaconsItem,
  TimeConfig,
  TagFilterExpressionElementUnion,
  CursorPagination,
  IngestionOffsetCursor
} from 'in-types';
import { EXPRESSION, OPERATOR_AND } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetEumBeaconByTraceQuery,
  Result<CursorPaginatedResult<EumBeaconByTraceBeaconsItem>>
>({
  eventId: 'getEumBeaconByTrace',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});

type MakeEumBeaconByTraceQueryProp = {
  metrics: Array<string>;
  timeConfig: TimeConfig;
  joinFilterExpression: TagFilterExpressionElementUnion;
  distinctBy: 'beaconByTrace.userIdOrSessionId' | 'beaconByTrace.configId';
  pagination?: CursorPagination<IngestionOffsetCursor>;
};

export function makeEumBeaconByTraceQuery({
  metrics,
  timeConfig,
  joinFilterExpression,
  distinctBy,
  pagination
}: MakeEumBeaconByTraceQueryProp): GetEumBeaconByTraceQuery {
  return {
    metrics,
    timeConfig,
    pagination: pagination || {
      cursor: undefined,
      retrievalSize: 15
    },
    order: {
      by: 'beaconByTrace.timestamp',
      direction: 'DESC'
    },
    tagFilterExpression: {
      type: EXPRESSION,
      logicalOperator: OPERATOR_AND,
      elements: []
    },
    distincts: [distinctBy],
    joins: [
      {
        source: 'JOIN_SOURCE_APPLICATION',
        type: 'JOIN_TYPE_IN',
        metric: 'beaconByTrace.truncatedBackendTraceId',
        tagFilterExpression: joinFilterExpression
      }
    ]
  };
}
