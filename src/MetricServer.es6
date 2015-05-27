'use strict';

import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getMaxValue} from 'instana-ui-sdk/metrics';
import {create} from 'instana-ui-services/conveyer';
import {combine} from 'instana-ui-services/util/rx';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';


export default class MetricServer {

  constructor(client) {
    this.subscriptions = [eventBus.on('showMetrics').subscribe(e =>
      this.showMetrics(e.metrics))];

    this.subscriptions.push(eventBus.on('hideMetrics').subscribe(() =>
      this.client.hideMetrics()));

    this.client = client;
    this.subscriptions = [];

    // const pluginId = 'com.instana.forge.infrastructure.os.Process';
    // const observable = create(SnapshotConveyer, {pluginId});
    //
    // this.subscriptions.push(
    //   observable.subscribe(data => this.onProcessUpdate(data))
    // );
  }

  onProcessUpdate(snapshots) {
    snapshots.forEach(process => {
      const hostId = process.get('hostId');
      if(hostId === this.client.snapshot.get('hostId')) {
        this.client.addProcess(process);
      }
    });
  }

  showMetrics(metrics) {
    if(this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;

    if(metrics.length === 1) {
      this.setupSingleMetric(metrics[0]);
    } else {
      this.setupMultiMetric(metrics);
    }
  }

  setupSingleMetric(metric) {
    const max = getMaxValue(metric, this.client.snapshot);
    const observable = create(MetricConveyer, {
      metric,
      frequency: 1000,
      snapshot: this.client.snapshot
    });
    this.metricSubscription = observable.subscribe(
      (value) => {
        this.client.setSingleMetricValue((max - value) / max);
        //console.log(value, max, (max - value) / max);
      }
    );
  }

  setupMultiMetric(metrics) {
    const tempSubscriptions = metrics.map(metric => {
      return create(MetricConveyer, {
        metric, frequency: 1000, snapshot: this.client.snapshot
      });
    });

    const multiMetricSource = combine(tempSubscriptions).throttle(200);
    this.metricSubscription = multiMetricSource.subscribe(value =>
      this.client.setMultiMetricValue(value));
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = null;

    this.subscriptions.forEach(sub => sub.dispose);
    this.subscriptions = [];
  }
}
