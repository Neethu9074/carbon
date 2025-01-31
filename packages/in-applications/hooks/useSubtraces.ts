/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { getSubtracesWithDefaults } from 'in-applications/subscriptions/getSubtraces';
import { SubtraceItem, Order, PaginatedResult, Pagination, Result } from '@instana/types';
import { getValueFromSingleValueMetric } from 'in-applications/metrics';
import { error, hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { SubtraceListItem } from 'in-applications/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

type Props = {
  order: Order;
  pagination: Pagination;
  query: string;
};

export const useSubtraces = ({ order, pagination, query = '' }: Props): Result<PaginatedResult<SubtraceListItem>> => {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(
      getSubtracesWithDefaults({
        filter: { timeConfig, subtraceName: query },
        order,
        pagination
      }),
      [
        generateStableHash(timeConfig),
        generateStableHash(order),
        generateStableHash(pagination),
        generateStableHash(query)
      ]
    ) ?? (pendingResult as Result<PaginatedResult<SubtraceItem>>);

  if (isLoading(result)) return pendingResult as Result<PaginatedResult<SubtraceListItem>>;
  if (hasError(result)) return error<PaginatedResult<SubtraceListItem>>(result.errors);

  const subtraceListItems: SubtraceListItem[] =
    result.data?.items.map(item => ({
      subtraceConfigId: item.subtraceConfigId!,
      subtraceName: item.subtraceName!,
      subtraceCount: getValueFromSingleValueMetric(item.metrics?.subtraceCount),
      calls: getValueFromSingleValueMetric(item.metrics?.calls),
      errorRate: getValueFromSingleValueMetric(item.metrics?.errorRate),
      duration: getValueFromSingleValueMetric(item.metrics?.duration)
    })) ?? [];

  return { ...result, data: { ...result.data!, items: subtraceListItems } };
};
