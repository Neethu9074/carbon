'use strict';

import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import {create} from 'instana-ui-services/conveyer';
import {combineLatest} from 'reactive-observables';

export function subscribeToMetric({metrics, snapshot, fn}) {
  const tempSubscriptions = metrics.map(metric => {
    return create(MetricConveyer, {
      metric: metric.get('name'),
      frequency: 1000,
      snapshot: snapshot
    });
  }).toJS();

  const metricSubscription = combineLatest(tempSubscriptions)
  .throttle(200)
  .subscribe((values) => {
    fn(values);
  });

  return metricSubscription;
}
