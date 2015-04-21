'use strict';

import Immutable from 'immutable';
import AbstractHttpConveyer from './AbstractHttpConveyer';

export default class MetricConveyer extends AbstractHttpConveyer {

  static getUniqueId({snapshot, metric, min, max, frequency, timeframe}) {
    return [
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metric,
      min,
      max,
      frequency,
      timeframe
    ].join(',');
  }

  constructor({snapshot, metric, min, max, frequency, timeframe}) {
    super({frequency});

    this.requestConfig = {
      method: 'get',
      url: '/api/metrics/lastn',
      queryParams: {
        hostId: snapshot.get('hostId'),
        pluginId: snapshot.get('pluginId'),
        steadyId: snapshot.get('steadyId'),
        metricName: metric,
        lastn: Math.floor(timeframe / frequency)
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
