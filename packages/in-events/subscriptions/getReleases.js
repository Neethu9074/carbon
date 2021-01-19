/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getReleases = createResultSubscriptionFactory({
  eventId: 'getReleases',
  disposeSubscriptionOnDocumentHidden: false
});

export default getReleases;

export function getReleasesWithDefaults({
  page = 1,
  pageSize = 5,
  orderBy = 'start',
  orderDirection = 'DESC',
  query = '',
  timeConfig = null
}) {
  return getReleases({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: query,
    timeConfig: timeConfig
  });
}
