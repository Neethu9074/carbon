/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getSapDbInstanceLists = createResultSubscriptionFactory({
  eventId: 'getSapDbInstanceLists'
});
export default getSapDbInstanceLists;

export function getSapDbInstanceListsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
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
