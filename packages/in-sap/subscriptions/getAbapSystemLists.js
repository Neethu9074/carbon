/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getAbapSystemLists = createResultSubscriptionFactory({
  eventId: 'getAbapSystemLists'
});
export default getAbapSystemLists;

export function getAbapSystemListsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
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
