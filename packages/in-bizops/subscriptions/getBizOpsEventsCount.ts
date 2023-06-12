/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetBizOpsEventsCountTimeSeriesQuery, Result } from 'in-types';

interface BizOpsEventsMetrics {
  readonly metrics: { [index: string]: number[][] };
}

export default createResultSubscriptionFactory<GetBizOpsEventsCountTimeSeriesQuery, Result<BizOpsEventsMetrics>>({
  eventId: 'getOpenBizOpsEventsCount'
});
