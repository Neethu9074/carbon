'use strict';

import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';
import {getHealth} from 'instana-ui-services/issueTracker';
import {getWiredSnapshots} from 'instana-ui-sdk/snapshot';
import {activeMetric} from 'instana-ui-services/stores/metrics';
import {subscribeToMetric} from './metricUtils';
import {getNormalizedValue} from 'instana-ui-sdk/metrics';
import {create} from 'instana-ui-services/conveyer';
import {level, zoomLevel} from 'instana-ui-services/stores/zoomLevel';

let currentMetric;


export default class NodeSnapshotServer {

  constructor(client) {
    this.client = client;

    this.subscriptions = [];

    this.subscriptions.push(getWiredSnapshots(client.snapshot)
      .subscribe(wiredSnapshots => client.setWiredSnapshots(wiredSnapshots)));

    this.subscriptions.push(getHealth(client.snapshot).subscribe(health =>
      client.setHealth(health)));

    this.subscriptions.push(activeMetric.subscribe(metric => {
      if(metric) {
        currentMetric = metric.get('metrics');
        this.showMetrics();
      } else {
        currentMetric = undefined;
        this.disposeMetricSubscription();
        client.hideMetrics();
      }
    }));

    this.subscriptions.push(zoomLevel.subscribe(zl => {
      this.zoomLevel = zl;
      if(zl === level.mid) {
        this.pauseMetrics();
      } else {
        this.resumeMetrics();
      }
    }));

    const pluginId = 'com.instana.forge.infrastructure.os.Process';
    const observable = create(SnapshotConveyer, {pluginId});
    this.subscriptions.push(observable.subscribe(data =>
      this.onLayerUpdate(data)));
  }

  onLayerUpdate(snapshots) {
    snapshots.forEach(layer => {
      if(layer.get('hostId') === this.client.snapshot.get('hostId')) {
        // this.client.addLayer(layer);
      }
    });
  }

  showMetrics() {
    this.disposeMetricSubscription();
    this.subscribeToCurrentMetric();
    this.client.showMetrics(currentMetric);
  }

  disposeMetricSubscription() {
    if(this.metricSubscription) {
      this.metricSubscription.dispose();
    }
    this.metricSubscription = undefined;
  }

  subscribeToCurrentMetric() {
    const client = this.client;
    const snapshot = client.snapshot;

    this.metricSubscription = subscribeToMetric({
      metrics: currentMetric, snapshot, fn: (values) => {
        try {
          client.setMetricValues(
            values.map((v, index) => {
              return getNormalizedValue(
                currentMetric.getIn([index, 'name']), snapshot, v);
            }
          ));
        } catch (err) {
          client.setMetricValues(values);
        }
      }
    });
  }

  pauseMetrics() {
    //because metrics could not be paused, we have to unsubscribe for the event
    this.disposeMetricSubscription();
  }

  resumeMetrics() {
    //if there was an active metric subscribtion which is paused,
    //resubscribe to it but only if there is a active metric
    if(!this.metricSubscription &&
      currentMetric &&
      (this.zoomLevel === level.near || this.zoomLevel === level.nearest)) {
      this.subscribeToCurrentMetric();
    }
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = null;
  }
}
