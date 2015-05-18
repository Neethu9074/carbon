'use strict';

import AbstractHttpConveyer from './AbstractHttpConveyer';

export default class MetricConveyer extends AbstractHttpConveyer {

  static getUniqueId({snapshot, metric, frequency}) {
    return [
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metric,
      frequency
    ].join(',');
  }

  constructor({snapshot, metric, frequency}) {
    super({frequency});

    this.requestConfig = {
      method: 'get',
      url: '/api/metrics/lastn',
      queryParams: {
        hostId: snapshot.get('hostId'),
        pluginId: snapshot.get('pluginId'),
        steadyId: snapshot.get('steadyId'),
        metricName: metric,
        lastn: 1
      }
    };
  }

  stop() {
    super.stop();
  }

  getHttpRequestConfig() {
    return this.requestConfig;
  }

  buildNextEvent(response) {
    return response.body[0];
  }
}
