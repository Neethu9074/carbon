

import * as connection from '../connection/subscriptionAwareConnection';
import _ from 'lodash';

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
        aggregate = this.insertSorted(aggregate, event.data);
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

  insertSorted(data, newElements) {
    _.forEach(newElements, element => {
      const elementTs = element[0];
      // we assume the data comes sorted, so searching from the end should
      // in most cases return the last index.
      const index = _.findLastIndex(data.values, v => v[0] <= elementTs);
      if (index === -1) {
        // if no elements have smaller timestamp, add it to the start
        data.values.unshift(element);
      } else {
        // only insert after that index if this is a not identical timestamp
        if (data.values[index][0] !== elementTs) {
          data.values.splice(index + 1, 0, element);
        }
      }
    });
    return data;
  }

  removeTooOldDataPoints(data) {
    const oldestDataPoint = data.values[0];
    const newestDataPoint = data.values[data.values.length - 1];
    const since = newestDataPoint[0] - this.timeframe;

    // if all data points are new enough, do not modify data
    if (oldestDataPoint[0] <= since) {
      // data.values is sorted by date. drop all elements less than since
      data.values = _.dropWhile(data.values, v => v[0] <= since);
    }
    return data;
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
