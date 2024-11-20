/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TABLE_METRIC_ADDED, TABLE_METRIC_CLEARED, TABLE_METRIC_REMOVED } from 'in-services/tracking/tracking';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { infraEventUIInteraction } from 'in-infrastructure/tracking/tracking';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { tablePath } from 'in-stores/navigation/paths/mainPaths';
import { createTrackingStore } from 'in-stores/store';

export const metrics$ = createTrackingStore({
  name: 'tableView/stores/metrics',
  observable: navigationParameters$
    .map(location => {
      const encodedMetrics = getMatrixParameter(location, tablePath, 'metrics');
      if (!encodedMetrics) {
        return [];
      }

      return encodedMetrics.split(',');
    })
    .distinct()
}).observable;

export function addMetric(metric) {
  infraEventUIInteraction({ event: TABLE_METRIC_ADDED, customData: { metric } });
  metrics$.once(metrics => {
    metrics = metrics.slice();
    metrics.push(metric);
    mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'metrics', metrics.join(',')));
  });
}

export function removeMetric(metric) {
  infraEventUIInteraction({ event: TABLE_METRIC_REMOVED, customData: { metric } });
  metrics$.once(metrics => {
    const i = metrics.indexOf(metric);
    if (i === -1) {
      return metrics;
    }
    const result = metrics.slice();
    result.splice(i, 1);
    mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'metrics', result.join(',')));
  });
}

export function clearMetrics() {
  infraEventUIInteraction({ event: TABLE_METRIC_CLEARED });
  mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'metrics'));
}
