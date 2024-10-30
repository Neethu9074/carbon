/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getNutanix = createResultSubscriptionFactory({
  eventId: 'getNutanixDatacenters'
});
export default getNutanix;

export function getNutanixWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'consoleName',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getNutanix({
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
