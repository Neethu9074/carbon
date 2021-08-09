/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LegacyAlertStats } from 'in-types';

interface GetLegacyAlertConfigStatsRequest {}

interface GetLegacyAlertConfigStatsResponse extends Result<LegacyAlertStats> {}

export default createResultSubscriptionFactory<GetLegacyAlertConfigStatsRequest, GetLegacyAlertConfigStatsResponse>({
  eventId: 'getLegacyAlertConfigStats',
  trackSubscriptionStatistics: true
});
