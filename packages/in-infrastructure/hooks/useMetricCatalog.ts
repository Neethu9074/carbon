/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Context, TagFilterExpressionElementUnion } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { TimeConfig } from '@instana/types';

import { getMetricCatalogOnce, GetMetricCatalog } from 'in-services/metrics/metricCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { MetricCatalog, Result } from 'in-types';

export interface UseMetricCatalogOptions {
  getMetricCatalog: GetMetricCatalog;
  tagFilterExpression: TagFilterExpressionElementUnion;
  type?: string;
  query?: string;
  context?: Context;
  withHierarchy?: boolean;
}

export default function useMetricCatalog({
  getMetricCatalog,
  tagFilterExpression,
  type,
  query,
  context,
  withHierarchy = false
}: UseMetricCatalogOptions): Result<MetricCatalog> {
  const timeConfig = useTimeConfig();

  // Creating a copy of TimeConfig and setting the window size to 1 minute.
  const modifiedTimeConfig = {
    ...timeConfig,
    windowSize: 60000
  } as TimeConfig;

  return (
    useObservable(
      () =>
        tagFilterExpression
          ? getMetricCatalogOnce(
              getMetricCatalog,
              withHierarchy,
              type
            )({
              filter: { tagFilterExpression, timeConfig: modifiedTimeConfig },
              type,
              query: query?.trim(),
              context
            })
          : just(pendingResult),
      [timeConfig, tagFilterExpression, type, query]
    ) || pendingResult
  );
}
