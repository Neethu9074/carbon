import _ from 'lodash';

import {getWiredSnapshots} from 'in-sdk/snapshot';
import {getMaxValue} from 'in-sdk/metrics';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {activeMetric} from 'in-services/stores/metrics';

import {selectedSceneObject, nodeMaxPower} from '../../../mapStores';
import {subscribeToMetric} from '../../../metricUtils';


export default class NodeSnapshotServer {

  constructor(client, connections) {
    this.client = client;
    this.subscriptions = [];
    this.connections = connections;

    this.subscriptions.push(activeMetric.subscribe(metric => {
      this.disposeMetricSubscription();
      if (metric) {
        this.currentMetric = metric.get('metrics');

        if (this.client.canShowMetrics) {
          this.subscribeToCurrentMetric();
          this.client.showMetrics(this.currentMetric);
        }
      } else {
        this.currentMetric = undefined;
        this.client.hideMetrics();
      }
    }));

    // TODO Simon: Can we remove this async / nextFrame call?
    this.subscriptions.push(selectedSnapshot.selectedSnapshot.nextFrame().subscribe(selected => {
        if (selected &&
          this.client.id === selected.get('id') &&
          !this.client.isSelected()) {
          selectedSceneObject.emit({sceneObject: this.client});
        }
      })
    );
  }

  onSnapshotUpdate() {
    const client = this.client;
    const snapshot = client.snapshot;

    // setup wiring subscription
    if (!this.connections) {
      this.disposeSubscription(this.wiredSnapshotsSubscription);
      this.wiredSnapshotsSubscription = getWiredSnapshots(snapshot).subscribe(ws => client.setWiredSnapshots(ws));
      this.subscriptions.push(this.wiredSnapshotsSubscription);
    }

    // setup height subscription
    this.disposeSubscription(this.maxHeightSubscribtion);
    this.maxHeightSubscribtion = nodeMaxPower.subscribe(maxPower => {
      if (maxPower) {
        const clientPower = this.client.calculatePower();
        if (clientPower < 0) {
          this.client.setHeight(1);
          return;
        }
        if (clientPower > maxPower) {
          nodeMaxPower.emit(clientPower);
          return;
        }
        this.client.updateHeight(maxPower);
      }
    });
    this.subscriptions.push(this.maxHeightSubscribtion);
  }

  disposeSubscription(subscribtion) {
    if (subscribtion && subscribtion.dispose) {
      subscribtion.dispose();
      _.remove(this.subscriptions, sub => sub === subscribtion);
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
      snapshot,
      fn: (values) => client.setMetricValues(values.map(v => v / maxValue))
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
    this.subscriptions.forEach(sub => {
      if (sub && sub.dispose) {
        sub.dispose();
      }
    });
    this.subscriptions = null;

    this.disposeMetricSubscription();

    this.client = null;
  }
}
