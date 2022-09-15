/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import {
  GetLocationListQuery,
  OrderDirection,
  PaginatedResult,
  Result,
  LocationListItem,
  TagFilter,
  TimeConfig
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getLocationList = createResultSubscriptionFactory<
  GetLocationListQuery,
  Result<PaginatedResult<LocationListItem>>
>({
  eventId: 'getLocationList',
  trackSubscriptionStatistics: true
});

export default getLocationList;

interface GetLocationListWithDefaultsProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  tagFilters?: TagFilter[];
}
export function getLocationListWithDefaults({
  //The value of query is from the Search box, by default, it is ''.
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'location_id',
  orderDirection = 'ASC',
  timeConfig,
  tagFilters = []
}: GetLocationListWithDefaultsProps): Observable<Result<PaginatedResult<LocationListItem>>> {
  return getLocationList({
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
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    tagFilters: tagFilters ? [...tagFilters] : undefined
  });
}
