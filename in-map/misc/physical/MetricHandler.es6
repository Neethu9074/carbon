import {combineLatest} from 'reactive-observables';

import {getMetricForFocusedMoment, activeMetric$} from 'in-stores/metric';
import {METRIC_PILLAR_REFRESH} from 'in-map/misc/TimingConfig';
import {getMaxValue} from 'in-sdk/metrics';


export default function createMetricHandler(node, snapshotId) {
    let metricSubscription = null;

    // the node will activate all component if the active metric fires. so metrics will be active, too.
    // maybe the node will be told about active metric after THIS subscription below fired, so we told
    // the node to disable metrics, and the node itself enables them because of it's own subscription.
    // to get rid of this race condition, we need to make sure that THIS subscription is called after the nodes one.
    // To get this effect, we use nextFrame().
    let showMetricSubscription = combineLatest([
      node.eventEmitter.on('snapshotChanged'),
      activeMetric$
    ]).subscribe(([snapshot, metric]) => {
      disposeMetricSubscription();

      if (metric && snapshot) {
        subscribeToCurrentMetric(snapshot, metric.get('metrics'), snapshotId);
      }
    });

  function disposeMetricSubscription() {
    if (metricSubscription) {
      metricSubscription.dispose();
    }
    metricSubscription = undefined;
  }

  function subscribeToCurrentMetric(snapshot, metrics) {
    const maxValue = getMaxValue(metrics.getIn([0, 'name']), snapshot);

    metricSubscription = combineLatest(metrics.toArray()
                                              .map(metric => getMetricForFocusedMoment({
                                                snapshotId,
                                                metric: metric.get('name')
                                              })
                                              .map(v => v[1] == null ? 0 : v[1] / maxValue)
                                              .distinct())
                                      )
                         .throttle(METRIC_PILLAR_REFRESH)
                         .subscribe(values => node.setMetricValues(values));
  }

  return {
    dispose
  };

  function dispose() {
    disposeMetricSubscription();

    showMetricSubscription.dispose();
    showMetricSubscription = null;
  }
}
