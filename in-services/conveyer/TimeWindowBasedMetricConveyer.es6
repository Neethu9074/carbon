'use strict';

import * as connection from '../connection/subscriptionAwareConnection';

export default class TimeWindowBasedMetricConveyer {

  static getUniqueId({snapshot, metric, timeframe}) {
    return [
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metric,
      timeframe
    ].join(',');
  }

  constructor({snapshot, metric, timeframe}) {
    this.id = connection.getSubscriptionId();
    this.timeframe = timeframe;

    this.subscribeEvent = {
      id: this.id,
      type: 'metric',
      event: 'subscribe',
      metric,
      timeframe,
      hostId: snapshot.get('hostId'),
      steadyId: snapshot.get('steadyId'),
      pluginId: snapshot.get('pluginId')
    };

    this.dataEventPredicate = e => e.id === this.id;
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(event => {
        onNext(event.data);
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
