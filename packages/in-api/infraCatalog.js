/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getPluginsWithCustomMetrics() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/infrastructure-monitoring/catalog/plugins-with-custom-metrics`
  }).map(response => fromJS(response.body));
}

export function getCustomMetricsForPlugin(plugin) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/infrastructure-monitoring/catalog/metrics/${encodeURIComponent(plugin)}`,
    queryParams: {
      filter: 'custom'
    }
  }).map(response => fromJS(response.body));
}
