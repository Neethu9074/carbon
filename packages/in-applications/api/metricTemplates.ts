/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/catalog/metricTemplates';

export const getMetricTemplates = memoize(getMetricTemplatesInternal, () => '', minutes.toMillis(10));

function getMetricTemplatesInternal() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: basePath,
    mapToResultObject: true
  });
}
