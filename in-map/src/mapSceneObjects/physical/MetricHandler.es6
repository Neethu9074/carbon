import {activeMetric} from 'in-services/stores/metrics';
import {emptyArray} from 'in-services/fixedObjects';
import {getMaxValue} from 'in-sdk/metrics';

import {subscribeToMetric} from '../../metricUtils';


export default class MetricHandler {

  constructor(client) {
    this.client = client;
    this.subscriptions = [];
    this.isOutOfView = false;
    this.currentMetric = undefined;

    this.subscriptions.push(activeMetric.subscribe(metric => {
      this.disposeMetricSubscription();
      if (metric) {
        this.currentMetric = metric.get('metrics');

        if (this.canShowMetrics) {
          this.subscribeToCurrentMetric();
          this.client.showMetrics(this.currentMetric);
        }
      } else {
        this.currentMetric = undefined;
        this.client.hideMetrics();
      }
    }));
  }

  setStateForMetricActivity({isOutOfView}) {
    if (isOutOfView !== undefined) {
      this.isOutOfView = isOutOfView;
    }

    if (!this.isOutOfView && this.currentMetric) {
      if (!this.canShowMetrics) {
        this.canShowMetrics = true;
        this.resumeMetrics();
        this.client.showMetrics();
      }
    } else {
      if (this.canShowMetrics) {
        this.canShowMetrics = false;
        this.pauseMetrics();
      }
    }
  }

  disposeMetricSubscription() {
    if (this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;
  }

  subscribeToCurrentMetric() {
    const client = this.client;
    const snapshot = client.snapshot;
    const maxValue = getMaxValue(this.currentMetric.getIn([0, 'name']), snapshot);

    this.metricSubscription = subscribeToMetric({
      metrics: this.currentMetric,
      id: this.client.id,
      fn: values => client.setMetricValues(values.map(v => v[1] / maxValue))
    });
  }

  pauseMetrics() {
    // because metrics could not be paused, we have to unsubscribe for the event
    this.disposeMetricSubscription();
  }

  resumeMetrics() {
    // if there was an active metric subscribtion which is paused,
    // resubscribe to it but only if there is a active metric
    if (!this.metricSubscription && this.currentMetric) {
      this.subscribeToCurrentMetric();
    }
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = emptyArray;

    this.disposeMetricSubscription();

    this.client = null;
    this.isOutOfView = null;
    this.currentMetric = null;
  }
}
