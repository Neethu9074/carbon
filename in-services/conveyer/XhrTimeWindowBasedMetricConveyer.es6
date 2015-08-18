import http from 'in-services/http';

export default class XhrTimeWindowBasedMetricConveyer {

  static getUniqueId({snapshot, metric, timeframe}) {
    return [
      snapshot.get('env'),
      snapshot.get('tenant'),
      snapshot.get('tenantUnit'),
      snapshot.get('hostId'),
      snapshot.get('pluginId'),
      snapshot.get('steadyId'),
      metric,
      timeframe
    ].join(',');
  }

  constructor({snapshot, metric, timeframe}) {
    this.timeframe = timeframe;


    this.subscribeEvent = {
      id: this.id,
      type: 'metric',
      event: 'subscribe',
      metric,
      timeframe,
      env: snapshot.get('env'),
      tenant: snapshot.get('tenant'),
      unit: snapshot.get('unit'),
      hostId: snapshot.get('hostId'),
      steadyId: snapshot.get('steadyId'),
      pluginId: snapshot.get('pluginId')
    };
  }

  start(onNext) {
    http({method: 'GET', url: '/internal/api/' +
                              this.subscribeEvent.env + '/' +
                              this.subscribeEvent.tenant + '/' +
                              this.subscribeEvent.unit + '/' +
                              this.subscribeEvent.hostId + '/' +
                              this.subscribeEvent.pluginId + '/' +
                              this.subscribeEvent.steadyId + '/' +
                              this.subscribeEvent.metric + '/' +
                              this.subscribeEvent.timeframe})
                                  .then(response => {
                                    onNext(response.body);
                                  });
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }
}
