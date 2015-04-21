'use strict';

import Immutable from 'immutable';
import AbstractHttpConveyer from './AbstractHttpConveyer';

export default class MultiMetricConveyer extends AbstractHttpConveyer {

  static getUniqueId({snapshot, metrics, min, max, frequency, timeframe}) {
    return [
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metrics.join(';'),
      min,
      max,
      frequency,
      timeframe
    ].join(',');
  }

  constructor({snapshot, metrics, min, max, frequency, timeframe}) {
    super({frequency});

    this.requestConfig = {
      method: 'post',
      url: '/api/metrics/lastn',
      data: {
        lastn: Math.floor(timeframe / frequency),
        metricSpec: metrics.map(metric => {
          return {
            hostId: snapshot.get('hostId'),
            pluginId: snapshot.get('pluginId'),
            steadyId: snapshot.get('steadyId'),
            metricName: metric
          };
        })
      }
    };

    this.previousEvent = Immutable.fromJS({
      min,
      max,
      frequency,
      timeframe
    });
  }

  stop() {
    super.stop();
    this.previousEvent = this.previousEvent.set('values', []);
  }

  getHttpRequestConfig() {
    return this.requestConfig;
  }

  buildNextEvent(response) {
    const newValues = Immutable.fromJS(response.body);
    if (Immutable.is(newValues, this.previousEvent.get('values'))) {
      return false;
    }

    this.previousEvent = this.previousEvent.set('values', newValues);
    return this.previousEvent;
  }

}
