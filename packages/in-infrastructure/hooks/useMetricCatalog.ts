/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';

import { getMetricCatalogOnce, GetMetricCatalog } from 'in-services/metrics/metricCatalog';
import { MetricCatalog, Result, TagFilterExpression } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export interface UseMetricCatalogOptions {
  getMetricCatalog: GetMetricCatalog;
  tagFilterExpression: TagFilterExpression;
  type?: string;
  query?: string;
}

export default function useMetricCatalog({
  getMetricCatalog,
  tagFilterExpression,
  type,
  query
}: UseMetricCatalogOptions): Result<MetricCatalog> {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () =>
        getMetricCatalogOnce(
          getMetricCatalog,
          type
        )({
          filter: { tagFilterExpression, timeConfig },
          type,
          query
        }),
      [timeConfig, tagFilterExpression, type, query]
    ) || pendingResult
  );
}
