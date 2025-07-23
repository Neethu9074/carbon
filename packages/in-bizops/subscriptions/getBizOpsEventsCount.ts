/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GetBizOpsEventsCountTimeSeriesQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface BizOpsEventsMetrics {
  readonly metrics: { [index: string]: number[][] };
}

export default createResultSubscriptionFactory<GetBizOpsEventsCountTimeSeriesQuery, Result<BizOpsEventsMetrics>>({
  eventId: 'getOpenBizOpsEventsCount'
});
