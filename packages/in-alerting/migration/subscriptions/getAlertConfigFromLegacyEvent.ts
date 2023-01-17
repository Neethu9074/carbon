/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, ApplicationAlertConfigMigrationItem } from '@instana/types';

interface GetAlertConfigFromLegacyEventRequest {}

export default createResultSubscriptionFactory<
  GetAlertConfigFromLegacyEventRequest,
  Result<ApplicationAlertConfigMigrationItem>
>({
  eventId: 'getAlertConfigFromLegacyEvent',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
