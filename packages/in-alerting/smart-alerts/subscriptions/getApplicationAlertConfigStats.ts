/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, ApplicationAlertStats } from 'in-types';

// yes, indeed, the requests is empty
interface GetApplicationAlertConfigStatsRequest {}

interface GetApplicationAlertConfigStatsResponse extends Result<ApplicationAlertStats> {}

export default createResultSubscriptionFactory<
  GetApplicationAlertConfigStatsRequest,
  GetApplicationAlertConfigStatsResponse
>({
  eventId: 'getApplicationAlertConfigStats',
  trackSubscriptionStatistics: true
});
