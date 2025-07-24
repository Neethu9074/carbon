/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  Result,
  PaginatedUIQuery,
  TimeConfig,
  GroupedBusinessMetricsItem,
  BizOpsMetricConfiguration,
  Group,
  Grouping,
  QueryWithMetrics,
  TagFilterExpressionElementUnion,
  TimeShift
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

// !TODO: Awaiting backend type generation. Delete once backend model is brought to UI client to add EUM type.
export type BizOpsDataType = 'ACTIVITY' | 'PROCESS' | 'PERSPECTIVE' | 'FLOW_OBJECT' | 'CUSTOM_METRIC' | 'EUM';

export interface BusinessDataQuery extends PaginatedUIQuery, QueryWithMetrics {
  readonly businessPerspectiveIdsWithAccess?: string[];
  readonly dataType: BizOpsDataType;
  readonly group?: Group;
  readonly grouping?: Grouping;
  readonly metrics?: { [index: string]: BizOpsMetricConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElementUnion;
  readonly timeConfig: TimeConfig;
  readonly timeShift?: TimeShift;
}

export default createResultSubscriptionFactory<BusinessDataQuery, Result<GroupedBusinessMetricsItem>>({
  eventId: 'getBusinessMetricsForWebsites',
  trackSubscriptionStatistics: true
});
