/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { TimeConfig } from '@instana/types';

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
              type
            )({
              filter: { tagFilterExpression, timeConfig: modifiedTimeConfig },
              type,
              query
            })
          : just(pendingResult),
      [timeConfig, tagFilterExpression, type, query]
    ) || pendingResult
  );
}
