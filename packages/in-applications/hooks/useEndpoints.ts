/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  AppDataMetricConfiguration,
  EndpointItem,
  Filter,
  GetEndpointsQuery,
  Order,
  PaginatedResult,
  Pagination,
  TagFilterExpression,
  TimeConfig
} from 'in-types';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getEndpoints from 'in-applications/subscriptions/getEndpoints';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface UseEndpointsProps {
  application?: string;
  service?: string;
  filter?: Partial<Filter>;
  metrics?: Record<string, AppDataMetricConfiguration>;
  order?: Partial<Order>;
  pagination?: Partial<Pagination>;
  supportedOrderByCriteria?: boolean;
  tagFilterExpression?: TagFilterExpression;
  time?: TimeConfig;
}

const DEFAULT_PAGE_SIZE = 100;

export default function useEndpoints(props: UseEndpointsProps): FetchedState<PaginatedResult<EndpointItem>> {
  const timeConfig = useTimeConfig();
  const modifiedTime = props.time ? props.time : timeConfig;
  const result = useObservable(
    () => getEndpoints(buildQuery(props, modifiedTime)),
    [generateStableHash(props), modifiedTime]
  );

  return resultToFetchedStateResponse(result);
}

function buildQuery(
  {
    application,
    service,
    filter,
    metrics,
    order,
    pagination,
    supportedOrderByCriteria,
    tagFilterExpression
  }: UseEndpointsProps,
  timeConfig: TimeConfig
): GetEndpointsQuery {
  return {
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false,
      application,
      service,
      ...filter
    },
    metrics: metrics ?? {},
    order: {
      by: 'endpointLabel',
      direction: 'ASC',
      ...order
    },
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...pagination
    },
    supportedOrderByCriteria: supportedOrderByCriteria ?? false,
    tagFilterExpression
  };
}
