/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { BusinessDataQuery, PaginatedResult, Result, BusinessPerspective } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<BusinessDataQuery, Result<PaginatedResult<BusinessPerspective>>>({
  eventId: 'getBusinessPerspectives',
  trackSubscriptionStatistics: true
});
