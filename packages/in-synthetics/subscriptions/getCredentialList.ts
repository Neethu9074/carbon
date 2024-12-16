/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import {
  OrderDirection,
  PaginatedQuery,
  PaginatedResult,
  Result,
  SyntheticCredential,
  SyntheticMetricConfiguration,
  TagFilterExpressionElementUnion
} from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetSyntheticCredentialListQuery extends PaginatedQuery {
  readonly metrics?: { [index: string]: SyntheticMetricConfiguration };
  readonly tagFilterExpression?: TagFilterExpressionElementUnion;
}

const getCredentialList = createResultSubscriptionFactory<
  GetSyntheticCredentialListQuery,
  Result<PaginatedResult<SyntheticCredential>>
>({
  eventId: 'getSyntheticCredentialList',
  trackSubscriptionStatistics: true
});

export default getCredentialList;

interface GetCredentialListWithDefaultsProps {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
}
export function getCredentialListWithDefaults({
  page = 1,
  pageSize = 20,
  orderBy = 'credentialName',
  orderDirection = 'ASC'
}: GetCredentialListWithDefaultsProps): Observable<Result<PaginatedResult<SyntheticCredential>>> {
  return getCredentialList({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    }
  });
}
