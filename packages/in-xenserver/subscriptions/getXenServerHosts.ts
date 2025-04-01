/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { OrderDirection, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getXenServerHosts = createResultSubscriptionFactory({
  eventId: 'getXenServerHosts'
});
export default getXenServerHosts;

export interface GetXenServerHostsWithDefaultProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}
export function getXenServerHostsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}: GetXenServerHostsWithDefaultProps) {
  return getXenServerHosts({
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
