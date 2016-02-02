import {combineLatest} from 'reactive-observables';

import {getLiveMetrics} from 'in-stores/metric';

export function subscribeToMetric({metrics, snapshot, fn}) {
  const tempSubscriptions = metrics.toArray().map(metric => {
    return getLiveMetrics({
      snapshotId: snapshot.get('id'),
      metric: metric.get('name')
    });
  });

  const metricSubscription = combineLatest(tempSubscriptions)
    .throttle(1000)
    .subscribe(fn);

  return metricSubscription;
}
