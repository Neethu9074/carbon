'use strict';

import * as metrics from 'instana-ui-sdk/metrics';

import * as connection from '../connection/subscriptionAwareConnection';

export default class MetricWithHistoryConveyer {

  static getUniqueId({snapshot, metric, since}) {
    return [
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metric,
      since
    ].join(',');
  }

  constructor({snapshot, metric, since}) {
    this.id = connection.getSubscriptionId();
    this.max = metrics.getMaxValue(metric);
    this.min = metrics.getMinValue(metric);

    this.subscribeEvent = {
      id: this.id,
      type: 'metric',
      event: 'subscribe',
      metric,
      since,
      hostId: snapshot.get('hostId'),
      steadyId: snapshot.get('steadyId'),
      pluginId: snapshot.get('pluginId')
    };

    this.dataEventPredicate = e => e.id === this.id;
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .scan((aggregate, event) => {
        aggregate.values = aggregate.values.concat(event.data);
        return aggregate;
      }, {
        min: this.min,
        max: this.max,
        values: []
      })
      .subscribe(data => {
        onNext(data);
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
