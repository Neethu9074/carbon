/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { OrderDirection, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getLinuxKVMHypervisorHosts = createResultSubscriptionFactory({
  eventId: 'getLinuxKVMHypervisorHosts'
});
export default getLinuxKVMHypervisorHosts;

export interface GetLinuxKVMHypervisorHostsWithDefaultProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}
export function getLinuxKVMHypervisorHostsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: GetLinuxKVMHypervisorHostsWithDefaultProps) {
  return getLinuxKVMHypervisorHosts({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      timeConfig
    }
  });
}
