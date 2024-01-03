/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { PaginatedResult, Result, BusinessDataQuery, BusinessActivity } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<BusinessDataQuery, Result<PaginatedResult<BusinessActivity>>>({
  eventId: 'getBusinessActivities',
  trackSubscriptionStatistics: true
});
