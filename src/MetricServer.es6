'use strict';

import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getNormalizedValue} from 'instana-ui-sdk/metrics';
import {create} from 'instana-ui-services/conveyer';
import {combine} from 'instana-ui-services/util/rx';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';


export default class MetricServer {

  constructor(client) {
    this.subscriptions = [eventBus.on('showMetrics').subscribe(e =>{
      this.showMetrics(e.metrics);
      this.client.showMetrics();
    })];

    this.subscriptions.push(eventBus.on('hideMetrics').subscribe(() => {
      this.disposeMetricSubscription();
      this.client.hideMetrics();
    }));

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
    this.disposeMetricSubscription();

    if(metrics.length === 1) {
      this.setupSingleMetric(metrics[0]);
    } else {
      this.setupMultiMetric(metrics);
    }
  }

  disposeMetricSubscription() {
    if(this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;
  }

  setupSingleMetric(metric) {
    this.createMetricSource = this.createSingleMetricSource;
    this.currentMetric = metric;

    this.currentMetricFunction = (v) => {
      this.client.setSingleMetricValue(getNormalizedValue(
        metric, this.client.snapshot, v
      ));
    };

    this.subscribeToCurrent();
  }

  setupMultiMetric(metrics) {
    this.createMetricSource = this.createMultiMetricSource;
    this.currentMetric = metrics;

    this.currentMetricFunction = (v) => this.client.setMultiMetricValue(v);

    this.subscribeToCurrent();
  }

  //reference to once, multi or single metric creator
  createMetricSource() {}

  createMultiMetricSource(metrics) {
    const tempSubscriptions = metrics.map(metric => {
      return create(MetricConveyer, {
        metric, frequency: 1000, snapshot: this.client.snapshot
      });
    });

    return combine(tempSubscriptions).throttle(200);
  }

  createSingleMetricSource(metric) {
    return create(MetricConveyer, {
      metric,
      frequency: 1000,
      snapshot: this.client.snapshot
    });
  }

  subscribeToCurrent() {
    const metric = this.currentMetric;
    this.currentMetricSource = this.createMetricSource(metric);

    this.metricSubscription = this.currentMetricSource.subscribe(value =>
      this.currentMetricFunction(value));
  }

  pauseMetrics() {
    //because metrics could not be paused, we have to unsubscribe for the event

    this.disposeMetricSubscription();
  }

  resumeMetrics() {
    //if there was an active metric subscribtion which is paused,
    //resubscribe to it but only if there was no hide metric or other metric
    //fired until then

    if(!this.metricSubscription && this.currentMetricSource) {
      this.subscribeToCurrent();
    }
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = null;

    this.subscriptions.forEach(sub => sub.dispose);
    this.subscriptions = [];
  }
}
