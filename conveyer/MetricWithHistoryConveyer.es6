'use strict';

import * as connection from '../connection/subscriptionAwareConnection';

export default class MetricWithHistoryConveyer {

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
      .scan((aggregate, event) => {
        aggregate.values = aggregate.values.concat(event.data);
        aggregate = this.sortByTimestamp(aggregate);
        aggregate = this.removeTooOldDataPoints(aggregate);
        return aggregate;
      }, {
        values: []
      })
      .subscribe(data => {
        onNext(data);
      });

    connection.subscribe(this.id, this.subscribeEvent);
  }

  sortByTimestamp(data) {
    data.values.sort((v1, v2) => {
      if (v1[0] < v2[0]) {
        return -1;
      } else if (v1[0] > v2[0]) {
        return 1;
      }
      return 0;
    });
    return data;
  }

  removeTooOldDataPoints(data) {
    const oldestDataPoint = data.values[0];
    const newestDataPoint = data.values[data.values.length - 1];
    const since = newestDataPoint[0] - this.timeframe;

    if (oldestDataPoint[0] > since) {
      // all data points are new enough
      return data;
    }

    // data.values is sorted by date. This means that we can stop iterating
    // once we have found at least one newer data point to determine the index
    // of old data points.
    let newerDataPointFound = false;
    let i = 0;
    const len = data.values.length;
    while (!newerDataPointFound && i < len) {
      const dataPoint = data.values[i];
      if (dataPoint[0] > since) {
        newerDataPointFound = true;
      } else {
        i++;
      }
    }

    if (newerDataPointFound) {
      data.values.splice(0, i);
    }

    return data;
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
