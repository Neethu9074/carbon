/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, AbapSystemListItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSapAbapSystemListsRequest {}

interface GetSapAbapSystemListsResponse extends Result<AbapSystemListItem> {}

const getAbapSystemLists = createResultSubscriptionFactory<GetSapAbapSystemListsRequest, GetSapAbapSystemListsResponse>(
  {
    eventId: 'getAbapSystemLists'
  }
);

interface AbapOrJavaSystemListsOptions {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: string;
  timeConfig: any;
}
export default getAbapSystemLists;

export function getAbapSystemListsWithDefaults(options: AbapOrJavaSystemListsOptions) {
  const { query = '', page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig } = options;
  return getAbapSystemLists({
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
