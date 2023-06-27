/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, AbapSystemListItem } from 'in-types';

interface GetSapAbapSystemListRequest {}

interface GetSapAbapSystemListResponse extends Result<AbapSystemListItem> {}

const getAbapOrJavaInstanceLists = createResultSubscriptionFactory<
  GetSapAbapSystemListRequest,
  GetSapAbapSystemListResponse
>({
  eventId: 'getAbapOrJavaInstanceLists'
});

export default getAbapOrJavaInstanceLists;

interface AbapOrJavaInstanceListsOptions {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: string;
  timeConfig: any;
}

export function getAbapOrJavaInstanceListsWithDefaults(options: AbapOrJavaInstanceListsOptions) {
  const { query = '', page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig } = options;
  return getAbapOrJavaInstanceLists({
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
