import {combineLatest} from 'reactive-observables';

import {getLiveMetrics} from 'in-stores/metric';

export function subscribeToMetric({metrics, id, fn}) {
  return combineLatest(
    metrics.toArray().map(metric => {
      return getLiveMetrics({
        snapshotId: id,
        metric: metric.get('name')
      });
    }))
    .throttle(1000)
    .subscribe(fn);
}
