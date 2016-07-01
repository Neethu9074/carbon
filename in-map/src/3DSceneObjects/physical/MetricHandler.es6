import {combineLatest} from 'reactive-observables';

import {activeMetric} from 'in-services/stores/metrics';
import {getLiveMetrics} from 'in-stores/metric';
import {getSnapshot} from 'in-stores/snapshot';
import {getMaxValue} from 'in-sdk/metrics';


export default class MetricHandler {

  constructor(client) {
    // the node will activate all component if the active metric fires. so metrics will be active, too.
    // maybe the node will be told about active metric after THIS subscription below fired, so we told
    // the node to disable metrics, and the node itself enables them because of it's own subscription.
    // to get rid of this race condition, we need to make sure that THIS subscription is called after the nodes one.
    // To get this effect, we use nextFrame().
    this.showMetricSubscription = combineLatest([
      getSnapshot(client.id),
      activeMetric,
      client.eventEmitter.on('isVisibleChanged_screenPosition').distinct()
    ]).subscribe(([snapshot, metric, isVisible]) => {
      this.disposeMetricSubscription();

      if (metric && snapshot && isVisible) {
        this.subscribeToCurrentMetric(snapshot, metric.get('metrics'), client);
        client.showMetrics();
      } else {
        client.hideMetrics();
      }
    });
  }

  disposeMetricSubscription() {
    if (this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;
  }

  subscribeToCurrentMetric(snapshot, metrics, client) {
    const maxValue = getMaxValue(metrics.getIn([0, 'name']), snapshot);

    this.metricSubscription = combineLatest(
      metrics.toArray()
             .map(metric => getLiveMetrics({
               snapshotId: client.id,
               metric: metric.get('name')
             }))).throttle(1000)
                 .subscribe(values => client.setMetricValues(values.map(v => v[1] / maxValue)));
  }

  dispose() {
    this.disposeMetricSubscription();

    this.showMetricSubscription.dispose();
    this.showMetricSubscription = null;

    this.client = null;
  }
}
