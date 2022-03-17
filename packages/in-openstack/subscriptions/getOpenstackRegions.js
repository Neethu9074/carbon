/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getOpenstackRegions = createResultSubscriptionFactory({
  eventId: 'getOpenstackRegions'
});
export default getOpenstackRegions;

export function getOpenstackRegionsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getOpenstackRegions({
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
