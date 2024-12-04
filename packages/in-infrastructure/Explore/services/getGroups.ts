/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { convertExploreQueryWithPrometheusCounterIncreaseToDeltaSum } from 'in-infrastructure/Explore/services/prometheusUtils';
import { CursorPaginatedResult, GetInfrastructureGroupsQuery, InfrastructureGroup, Result } from 'in-types';
import originalGetGroups from 'in-infrastructure/subscriptions/getGroups';

export default function (
  query: GetInfrastructureGroupsQuery
): Observable<Result<CursorPaginatedResult<InfrastructureGroup>>> {
  return originalGetGroups(convertExploreQueryWithPrometheusCounterIncreaseToDeltaSum(query));
}
