/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { OrderDirection, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getWindowsHypervisorHosts = createResultSubscriptionFactory({
  eventId: 'getWindowsHypervisorHosts'
});
export default getWindowsHypervisorHosts;

export interface GetWindowsHypervisorHostsWithDefaultProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}
export function getWindowsHypervisorHostsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: GetWindowsHypervisorHostsWithDefaultProps) {
  return getWindowsHypervisorHosts({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      name: query,
      timeConfig
    }
  });
}
