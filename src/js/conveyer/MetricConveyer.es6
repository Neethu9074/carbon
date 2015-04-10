'use strict';

import Immutable from 'immutable';
import http from '../http';

export default class MetricConveyer {
  constructor({snapshot, metric, min, max, frequency, timeframe}) {
    // we are using a mutable version for fast property access
    this.snapshot = snapshot.toJS();
    this.metric = metric;
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

    const now = new Date();
    http({
      method: 'get',
      url: '/api/metrics',
      queryParams: {
        hostId: this.snapshot.hostId,
        pluginId: this.snapshot.pluginId,
        steadyId: this.snapshot.steadyId,
        metricName: this.metric,
        rangeStart: now.getTime() - this.timeframe,
        rangeEnd: now.getTime()
      }
    })
    .then(response => {
      if (!this.running) return;

      const values = response.body;
      if (!Immutable.is(this.lastEvent.get('values'), values)) {
        this.lastEvent = this.lastEvent.set('values', values);
        this.onNext(this.lastEvent);
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
