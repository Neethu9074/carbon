/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getSapHanaLists = createResultSubscriptionFactory({
  eventId: 'getSapDbInstanceHanaLists'
});
export default getSapHanaLists;

export function getSapDbInstanceHanaLists({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getSapHanaLists({
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
