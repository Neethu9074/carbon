/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetActionStatsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface ActionAverageExecutionResult {
  avgExecutionTime: number;
  actionId: string;
}

export const getActionAverageExecutionResult = createResultSubscriptionFactory<
  GetActionStatsQuery,
  Result<ActionAverageExecutionResult>
>({
  eventId: 'getActionAvgExecutionTime',
  trackSubscriptionStatistics: true,
  memoizeFor: 0
});
