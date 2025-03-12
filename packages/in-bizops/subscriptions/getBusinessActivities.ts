/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { PaginatedResult, Result, BusinessDataQuery, BusinessActivityItem } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<BusinessDataQuery, Result<PaginatedResult<BusinessActivityItem>>>({
  eventId: 'getBusinessActivities',
  trackSubscriptionStatistics: true
});
