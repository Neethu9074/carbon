/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GetActionStatsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface ActionSuccessRateResult {
  successCount: number;
  total: number;
  actionId: string;
}

export const getActionSuccessRate = createResultSubscriptionFactory<
  GetActionStatsQuery,
  Result<ActionSuccessRateResult>
>({
  eventId: 'getActionSuccessRate',
  trackSubscriptionStatistics: true,
  memoizeFor: 0
});
