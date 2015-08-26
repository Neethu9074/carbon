import _ from 'lodash';

import {getWiredSnapshots} from 'in-sdk/snapshot';
import {getNormalizedValue} from 'in-sdk/metrics';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {level, zoomLevel} from 'in-services/stores/zoomLevel';
import {activeMetric} from 'in-services/stores/metrics';

import {selectedSceneObject} from './stores/mapStore';
import {subscribeToMetric} from './metricUtils';

let currentMetric;


export default class NodeSnapshotServer {

  constructor(client) {
    this.client = client;

    this.subscriptions = [];

    this.subscriptions.push(activeMetric.subscribe(metric => {
      this.disposeMetricSubscription();
      if(metric) {
        currentMetric = metric.get('metrics');

        if(this.client.canShowMetrics) {
          this.subscribeToCurrentMetric();
          this.client.showMetrics(currentMetric);
        }
      } else {
        currentMetric = undefined;
        this.client.hideMetrics();
      }
    }));

    this.subscriptions.push(zoomLevel.subscribe(zl => {
      this.zoomLevel = zl;
      if(zl === level.mid) {
        client.setStateForMetricActivity({ isToFarAway: true });
      } else {
        client.setStateForMetricActivity({ isToFarAway: false });
      }
    }));

    this.subscriptions.push(selectedSnapshot.selectedSnapshot.async().subscribe(selected => {
        if(selected &&
          this.client.id === selected.get('id') &&
          !this.client.isSelected()) {
          selectedSceneObject.emit({sceneObject: this.client});
        }
      })
    );
  }

  onSnapshotUpdate() {
    const client = this.client;

    if(this.wiredSnapshotsSubscription) {
      this.wiredSnapshotsSubscription.dispose();
      _.remove(this.subscriptions, sub => sub === this.wiredSnapshotsSubscription);
    }

    this.wiredSnapshotsSubscription = getWiredSnapshots(client.snapshot)
      .subscribe(wiredSnapshots => client.setWiredSnapshots(wiredSnapshots));
    this.subscriptions.push(this.wiredSnapshotsSubscription);
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
    if(!this.metricSubscription && currentMetric) {
      this.subscribeToCurrentMetric();
    }
  }

  dispose() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = null;

    this.disposeMetricSubscription();

    this.client = null;
  }
}
