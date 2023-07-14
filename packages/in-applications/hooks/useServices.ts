/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  AppDataMetricConfiguration,
  ContextScope,
  Filter,
  GetServicesQuery,
  Order,
  PaginatedResult,
  Pagination,
  ServiceItem,
  TagFilterExpression,
  TimeConfig
} from 'in-types';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getServices from 'in-applications/subscriptions/getServices';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface UseServicesProps {
  application?: string;
  filter?: Partial<Filter>;
  metrics?: Record<string, AppDataMetricConfiguration>;
  order?: Partial<Order>;
  pagination?: Partial<Pagination>;
  tagFilterExpression?: TagFilterExpression;
  contextScope?: ContextScope;
}

const DEFAULT_PAGE_SIZE = 100;

export default function useServices(props: UseServicesProps): FetchedState<PaginatedResult<ServiceItem>> {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => getServices(buildQuery(props, timeConfig)), [
    generateStableHash(props),
    timeConfig
  ]);

  return resultToFetchedStateResponse(result);
}

function buildQuery(
  { application, filter, metrics, order, pagination, tagFilterExpression, contextScope }: UseServicesProps,
  timeConfig: TimeConfig
): GetServicesQuery {
  return {
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false,
      application,
      ...filter
    },
    metrics: metrics ?? {},
    order: {
      by: 'serviceLabel',
      direction: 'ASC',
      ...order
    },
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...pagination
    },
    tagFilterExpression,
    contextScope: contextScope ?? 'NONE'
  };
}
