/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  GetTestResultListQuery,
  OrderDirection,
  PaginatedResult,
  Result,
  TestResultListItem,
  TagFilter,
  TimeConfig
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getTestResultList = createResultSubscriptionFactory<
  GetTestResultListQuery,
  Result<PaginatedResult<TestResultListItem>>
>({
  eventId: 'getTestResultList',
  trackSubscriptionStatistics: true
});

export default getTestResultList;

interface GetTestResultListWithDefaultsProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  tagFilters?: TagFilter[];
}
export function getTestResultListWithDefaults({
  query = 'testResultList',
  page = 1,
  pageSize = 20,
  orderBy = 'response_time',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters = []
}: GetTestResultListWithDefaultsProps): Observable<Result<PaginatedResult<TestResultListItem>>> {
  return getTestResultList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    syntheticMetrics: ['response_time'],
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
