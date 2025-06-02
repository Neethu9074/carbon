/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig, MetricCatalog, Result, Context, TagFilterExpressionElementUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { and, useFilterContext } from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getMetricCatalogOnce, GetMetricCatalog } from 'in-services/metrics/metricCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

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

  const filterContext = useFilterContext();
  const contextTagFilterExpression = toBackendQueryModel(filterContext);

  return (
    useObservable(
      () =>
        tagFilterExpression
          ? getMetricCatalogOnce(
              getMetricCatalog,
              withHierarchy,
              type
            )({
              filter: {
                tagFilterExpression: and(contextTagFilterExpression, tagFilterExpression),
                timeConfig: modifiedTimeConfig
              },
              type,
              query: query?.trim(),
              context
            })
          : just(pendingResult),
      [timeConfig, tagFilterExpression, type, query]
    ) || pendingResult
  );
}
