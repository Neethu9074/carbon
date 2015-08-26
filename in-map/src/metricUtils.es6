import {combineLatest} from 'reactive-observables';

import MetricConveyer from 'in-services/conveyer/MetricConveyer';
import {create} from 'in-services/conveyer';

export function subscribeToMetric({metrics, snapshot, fn}) {
  const tempSubscriptions = metrics.map(metric => {
    return create(MetricConveyer, {
      metric: metric.get('name'),
      snapshot: snapshot
    });
  }).toJS();

  const metricSubscription = combineLatest(tempSubscriptions)
  .throttle(1000)
  .subscribe((values) => {
    fn(values);
  });

  return metricSubscription;
}
