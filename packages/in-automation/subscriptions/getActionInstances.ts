/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  GetActionInstancesQuery,
  ActionInstance,
  OrderDirection,
  PaginatedResult,
  Result,
  TimeConfig
} from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getActionInstances = createResultSubscriptionFactory<
  GetActionInstancesQuery,
  Result<PaginatedResult<ActionInstance>>
>({
  eventId: 'getActionInstancesList',
  trackSubscriptionStatistics: true,
  memoizeFor: 0
});

export default getActionInstances;

interface getActionInstancesWithDefaultsProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  types?: string[];
  actionStatuses?: string[];
}

export function getActionInstancesWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'actionName',
  orderDirection = 'ASC',
  timeConfig,
  types = [],
  actionStatuses = []
}: getActionInstancesWithDefaultsProps) {
  return getActionInstances({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },

    search: query,
    timeConfig,
    types: types,
    actionStatuses: actionStatuses
  });
}
