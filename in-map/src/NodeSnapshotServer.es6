import {getWiredSnapshots} from 'in-sdk/snapshot';
import {getNormalizedValue} from 'in-sdk/metrics';
import {plugins} from 'in-forge/constants';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {activeMetric} from 'in-services/stores/metrics';
import {isIdEqual} from 'in-services/util/snapshots';
import {create} from 'in-services/conveyer';

import {selectedSceneObject} from './stores/mapStore';
import {subscribeToMetric} from './metricUtils';

let currentMetric;


export default class NodeSnapshotServer {

  constructor(client) {
    this.client = client;

    this.subscriptions = [];

    this.subscriptions.push(getWiredSnapshots(client.snapshot)
      .subscribe(wiredSnapshots => client.setWiredSnapshots(wiredSnapshots)));

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

    this.subscriptions.push(
      selectedSnapshot.selectedSnapshot.async().subscribe(selected => {
        if(isIdEqual(this.client.snapshot, selected) &&
           !this.client.isSelected()) {
          selectedSceneObject.emit({sceneObject: this.client});
        }
      })
    );

    this.subscriptions
      .push(create(SnapshotConveyer, {pluginId: plugins.process})
      .subscribe(data => this.onLayerUpdate(data)));

    this.subscriptions
      .push(create(SnapshotConveyer, {pluginId: plugins.docker})
      .subscribe(data => this.onLayerUpdate(data)));
  }

  onLayerUpdate(snapshots) {
    snapshots.forEach(layer => {
      if(layer.get('hostId') === this.client.snapshot.get('hostId')) {
        this.client.addLayer(layer);
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
