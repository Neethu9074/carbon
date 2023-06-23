/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemListItem } from 'in-types';

interface GetSapDbInstanceListsRequest {}

interface GetSapDbInstanceListsResponse extends Result<AbapSystemListItem> {}

const getSapDbInstanceLists = createResultSubscriptionFactory<
  GetSapDbInstanceListsRequest,
  GetSapDbInstanceListsResponse
>({
  eventId: 'getSapDbInstanceLists'
});

interface SapDbInstanceListsOptions {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: string;
  timeConfig: any;
}

export default getSapDbInstanceLists;

export function getSapDbInstanceListsWithDefaults(options: SapDbInstanceListsOptions) {
  const { query = '', page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig } = options;
  return getSapDbInstanceLists({
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
