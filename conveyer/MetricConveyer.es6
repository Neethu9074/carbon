'use strict';

import * as connection from '../connection/subscriptionAwareConnection';

export default class MetricConveyer {

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

    this.subscribeEvent = {
      id: this.id,
      type: 'metric',
      event: 'subscribe',
      metric,
      hostId: snapshot.get('hostId'),
      steadyId: snapshot.get('steadyId'),
      pluginId: snapshot.get('pluginId')
    };

    if (since) {
      this.subscribeEvent.since = since;
    }

    this.dataEventPredicate = e => e.id === this.id;
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(e => {
        if (this.subscribeEvent.since) {
          onNext(e.data);
        } else {
          onNext(e.v);
        }
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
