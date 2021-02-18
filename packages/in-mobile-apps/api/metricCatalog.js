/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

export const getMetricCatalog = memoize(getMetricCatalogInternal, () => '', minutes.toMillis(10));

function getMetricCatalogInternal() {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: '/api/mobile-app-monitoring/catalog/metrics'
    })
  );
}
