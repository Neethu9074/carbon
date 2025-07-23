/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Result, LegacyAlertStats } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetLegacyAlertConfigStatsRequest {}

interface GetLegacyAlertConfigStatsResponse extends Result<LegacyAlertStats> {}

export default createResultSubscriptionFactory<GetLegacyAlertConfigStatsRequest, GetLegacyAlertConfigStatsResponse>({
  eventId: 'getLegacyAlertConfigStats',
  trackSubscriptionStatistics: true
});
