'use strict';

import Immutable from 'immutable';
import http from '../http';
import {createLogger} from 'instalog';

const logger = createLogger('ui-services/conveyer/MultiMetricConveyer');

export default class MultiMetricConveyer {

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
    // we are using a mutable version for fast property access
    this.snapshot = snapshot.toJS();
    this.metrics = metrics;
    this.min = min;
    this.max = max;
    this.frequency = frequency;
    this.timeframe = timeframe;
    this.lastEvent = Immutable.fromJS({
      min,
      max,
      frequency,
      timeframe
    });
    this.run = this.run.bind(this);
  }

  start(onNext, onError) {
    this.running = true;
    this.onNext = onNext;
    this.onError = onError;
    this.run();
  }

  run() {
    if (!this.running) return;

    http({
      method: 'post',
      url: '/api/metrics/lastn',
      data: {
        lastn: Math.floor(this.timeframe / this.frequency),
        metricSpec: this.metrics.map(metric => {
          return {
            hostId: this.snapshot.hostId,
            pluginId: this.snapshot.pluginId,
            steadyId: this.snapshot.steadyId,
            metricName: metric
          };
        })
      }
    })
    .then(response => {
      if (!this.running) return;

      const values = Immutable.fromJS(response.body);
      if (!Immutable.is(this.lastEvent.get('values'), values)) {
        this.lastEvent = this.lastEvent.set('values', values);
        this.onNext(this.lastEvent);
      } else {
        logger.debug(
          'Assuming that values have not changed for steadyId %s and ' +
          'metric %s. New values:',
          this.snapshot.steadyId,
          this.metric,
          values.toJS()
        );
      }
      setTimeout(this.run, this.frequency);
    }, error => {
      if (!this.running) return;
      this.onError(error);
      setTimeout(this.run, this.frequency);
    });
  }

  stop() {
    this.running = false;
    this.lastEvent = null;
  }
}
