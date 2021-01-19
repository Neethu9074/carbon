/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getCloudfoundryApplications = createResultSubscriptionFactory({
  eventId: 'getCloudfoundryApplications'
});
export default getCloudfoundryApplications;

export function getCloudfoundryApplicationsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig
}) {
  return getCloudfoundryApplications({
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
