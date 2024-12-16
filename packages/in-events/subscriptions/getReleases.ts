/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { GetReleasesQuery, OrderDirection, PaginatedResult, Release, Result, TimeConfig } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getReleases: (parameter: GetReleasesQuery) => Observable<Result<PaginatedResult<Release>>> =
  createResultSubscriptionFactory<GetReleasesQuery, Result<PaginatedResult<Release>>>({
    eventId: 'getReleases',
    disposeSubscriptionOnDocumentHidden: false
  });

export default getReleases;

interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  query?: string;
  timeConfig?: TimeConfig;
}

export function getReleasesWithDefaults({
  page = 1,
  pageSize = 5,
  orderBy = 'start',
  orderDirection = 'DESC',
  query = '',
  timeConfig
}: QueryParams): Observable<Result<PaginatedResult<Release>>> {
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
