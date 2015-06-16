'use strict';

import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getNormalizedValue} from 'instana-ui-sdk/metrics';
import {create} from 'instana-ui-services/conveyer';
import {getHealth} from 'instana-ui-services/health';
import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {combineLatest} from 'reactive-observables';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import * as snapshotStore from 'instana-ui-services/stores/selectedSnapshot';

let currentMetric;

export default class NodeSnapshotServer {

  constructor(client) {
    this.client = client;

    this.subscriptions = [eventBus.on('showMetrics').subscribe(e =>{
      currentMetric = e.metrics;
      this.showMetrics();
    })];

    this.subscriptions.push(eventBus.on('hideMetrics').subscribe(() => {
      currentMetric = undefined;
      this.disposeMetricSubscription();
      client.hideMetrics();
    }));

    this.subscriptions.push(eventBus.on('upateMetricHeights').subscribe(() =>
      client.updateMetricHeight()));

    this.subscriptions.push(snapshotStore.selectedSnapshot.subscribe((s) =>{
      if(s && isIdEqual(s, client.snapshot)) {
        client.select();
      }
    }));

    this.subscriptions.push(getHealth(client.snapshot).subscribe(health =>
      client.setHealth(health)));

    // const pluginId = 'com.instana.forge.infrastructure.os.Process';
    // const observable = create(SnapshotConveyer, {pluginId});
    //
    // this.subscriptions.push(
    //   observable.subscribe(data => this.onLayerUpdate(data))
    // );

    //if there is an active metric, subscribe to it
    if(currentMetric) {
      this.showMetrics();
    }
  }

  onLayerUpdate(snapshots) {
    snapshots.forEach(layer => {
      const nodeId = layer.get('hostId');
      if(nodeId === this.client.snapshot.get('hostId')) {
        this.client.addLayer(layer);
      }
    });
  }

  showMetrics() {
    this.disposeMetricSubscription();

    if(currentMetric.length === 1) {
      this.setupSingleMetric();
    } else {
      this.setupMultiMetric();
    }

    this.client.showMetrics();
  }

  disposeMetricSubscription() {
    if(this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;
  }

  setupSingleMetric() {
    this.createMetricSource = this.createSingleMetricSource;

    this.currentMetricFunction = (v) => {
      this.client.setSingleMetricValue(getNormalizedValue(
        currentMetric[0], this.client.snapshot, v
      ));
    };

    this.subscribeToCurrent();
  }

  setupMultiMetric() {
    this.createMetricSource = this.createMultiMetricSource;
    this.currentMetricFunction = (v) => this.client.setMultiMetricValue(v);

    this.subscribeToCurrent();
  }

  //reference to once, multi or single metric creator
  createMetricSource() {}

  //this is one of the possible metric creation method for multiple metrics
  createMultiMetricSource(metrics) {
    const tempSubscriptions = metrics.map(metric => {
      return create(MetricConveyer, {
        metric, frequency: 1000, snapshot: this.client.snapshot
      });
    });

    return combineLatest(tempSubscriptions).throttle(200);
  }

  //this is one of the possible metric creation method for single metrics
  createSingleMetricSource() {
    const metric = currentMetric[0];
    return create(MetricConveyer, {
      metric,
      frequency: 1000,
      snapshot: this.client.snapshot
    });
  }

  /* takes the current method reference for creating a subscribtion and
  * subscribes to it.
  */
  subscribeToCurrent() {
    const metricSource = this.createMetricSource(currentMetric);

    this.metricSubscription = metricSource.subscribe(value =>
      this.currentMetricFunction(value));
  }

  pauseMetrics() {
    //because metrics could not be paused, we have to unsubscribe for the event
    this.disposeMetricSubscription();
  }

  resumeMetrics() {
    //if there was an active metric subscribtion which is paused,
    //resubscribe to it but only if there is a active metric
    if(!this.metricSubscription && currentMetric) {
      this.subscribeToCurrent();
    }
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = null;
  }
}
