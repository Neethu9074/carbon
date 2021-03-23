/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';

import { getMetricCatalogOnce } from 'in-services/metrics/metricCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useMetricCatalog({ getMetricCatalog, tagFilterExpression }) {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () => getMetricCatalogOnce(getMetricCatalog)({ timeConfig, filter: { tagFilterExpression, timeConfig } }),
      [getMetricCatalog, timeConfig, tagFilterExpression]
    ) ?? pendingResult
  );
}
