'use strict';

import _ from 'lodash';
import eventBus from 'instana-ui-services/eventbus';
import {getMaxValue} from 'instana-ui-sdk/metrics';
import {create} from 'instana-ui-services/conveyer';
import {combine} from 'instana-ui-services/util/rx';
import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
import SnapshotConveyer from 'instana-ui-services/conveyer/SnapshotConveyer';

/*eslint-disable no-console*/
//console.log('----->', MetricConveyer);
/*eslint-enable no-console*/

export default class MetricServer {

  constructor(client) {
    this.externalSubscription =
      eventBus.on('showMetrics').subscribe(e => this.showMetrics(e.metrics));

    this.client = client;
    this.subscriptions = [];

    const pluginId = 'com.instana.forge.infrastructure.os.Process';
    const observable = create(SnapshotConveyer, {pluginId});
    this.sub = observable.subscribe(data => this.onProcessUpdate(data));
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
    this.disposeOldSubscriptions();

    if(metrics.length === 1) {
      this.setupSingleMetric(metrics[0]);
    } else {
      this.setupMultiMetric(metrics);
    }
  }

  disposeOldSubscriptions() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = [];
  }

  setupSingleMetric(metric) {
    const max = getMaxValue(metric, this.client.snapshot);
    const observable = create(MetricConveyer, {
      metric,
      frequency: 1000,
      snapshot: this.client.snapshot
    });
    this.subscriptions.push(observable.subscribe(value =>
      this.client.setSingleMetricValue(value / max)
    ));
  }

  setupMultiMetric(metrics) {
    const tempSubscriptions = metrics.map(metric => {
      return create(MetricConveyer, {
        metric, frequency: 1000, snapshot: this.client.snapshot
      });
    });

    const multiMetricSource = combine(tempSubscriptions).throttle(200);
    this.subscriptions.push(multiMetricSource.subscribe(value =>
      this.client.setMultiMetricValue(value)
    ));
  }

  dispose() {
    this.externalSubscription.dispose();
    this.externalSubscription = null;

    this.subscriptions.forEach(sub => sub.dispose);
    this.subscriptions = [];
  }
}
