/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Result,
  GetImpactedBeaconQuery,
  CursorPaginatedResult,
  ImpactedBeaconItem,
  TimeConfig,
  TagFilterExpressionElementUnion,
  CursorPagination,
  IngestionOffsetCursor
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default function getImpactedBeacons(queryParameters: GetImpactedBeaconQuery, eventId: string) {
  return createResultSubscriptionFactory<GetImpactedBeaconQuery, Result<CursorPaginatedResult<ImpactedBeaconItem>>>(
    {
      eventId, // Use the passed eventId
      disposeSubscriptionOnDocumentHidden: false,
      trackSubscriptionStatistics: true
    }
  )(queryParameters);
}

type MakeEumImpactedBeaconsQueryProp = {
  columns: Array<string>;
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpressionElementUnion;
  distinctColumns: string[];
  pagination?: CursorPagination<IngestionOffsetCursor>;
  order: {
    by: string;
    direction: 'ASC' | 'DESC';
  };
};

export function makeEumImpactedBeaconsQuery({
  columns,
  timeConfig,
  tagFilterExpression,
  distinctColumns,
  pagination,
  order
}: MakeEumImpactedBeaconsQueryProp): GetImpactedBeaconQuery {
  return {
    columns,
    timeConfig,
    tagFilterExpression: tagFilterExpression,
    distinctColumns: [...distinctColumns],
    pagination: pagination || {
      cursor: undefined,
      retrievalSize: 15
    },
    order
  };
}
