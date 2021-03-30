/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getMetricCatalogOnce } from 'in-services/metrics/metricCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function useMetricCatalog({ getMetricCatalog, tagFilterExpression = EMPTY_EXPRESSION, query }) {
  const timeConfig = useTimeConfig();
  return (
    useObservable(
      () =>
        getMetricCatalogOnce(getMetricCatalog)({
          timeConfig,
          filter: { tagFilterExpression, timeConfig },
          query
        }),
      [getMetricCatalog, timeConfig, tagFilterExpression, query]
    ) ?? pendingResult
  );
}
