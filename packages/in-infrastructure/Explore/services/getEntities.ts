/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { convertExploreQueryWithPrometheusCounterIncreaseToDeltaSum } from 'in-infrastructure/Explore/services/prometheusUtils';
import { GetInfrastructureExploreQuery, InfrastructureItem, PaginatedResult, Result } from 'in-types';
import originalGetEntities from 'in-infrastructure/subscriptions/getEntities';

export default function (
  query: GetInfrastructureExploreQuery
): Observable<Result<PaginatedResult<InfrastructureItem>>> {
  return originalGetEntities(convertExploreQueryWithPrometheusCounterIncreaseToDeltaSum(query));
}
