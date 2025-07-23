/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { PaginatedResult, Result, ActivityServicesQuery, Service } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface ActivityServiceItem {
  service: Service;
  metrics: { [index: string]: number[][] };
}

export default createResultSubscriptionFactory<ActivityServicesQuery, Result<PaginatedResult<ActivityServiceItem>>>({
  eventId: 'getActivityServices',
  trackSubscriptionStatistics: true
});
