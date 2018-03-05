import ParticleEmitter from 'in-components/FlowMap/misc/ParticleEmitter';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';
import Subscriber from 'in-map/misc/Subscriber';

export default class Connection extends SceneObject {
  constructor(serviceLocatorUid, from, to, connectionService) {
    super(createConnectionId(from, to), serviceLocatorUid);

    this.serviceLocatorUid = serviceLocatorUid;
    this.from = from;
    this.to = to;
    this.particleEmitter = new ParticleEmitter(from, serviceLocatorUid);

    this.setMetrics();
    this.initStartSubscriptions(connectionService);
  }

  initStartSubscriptions(connectionService) {
    this.subscriber = new Subscriber();
    this.subscriber.addSubscription(
      this.from.events$.on('metricValues').subscribe(metrics => {
        const calls = metrics.callsAgg ? metrics.callsAgg[0][1] : 0;
        const errors = metrics.errorsAgg ? metrics.errorsAgg[0][1] : 0;
        const latency = metrics.latencyAgg ? metrics.latencyAgg[0][1] : 0;
        this.setMetrics(calls, errors, latency);
        connectionService.requestConnectionColorUpdate();
      })
    );
  }

  setFromAndTo(from, to) {
    this.from = from;
    this.to = to;
  }

  setMetrics(calls, errors, latency) {
    this.calls = calls || 0;
    this.errors = errors || 0;
    this.latency = latency || 0;
  }

  getMetricValue(metric) {
    return this[metric] || 0;
  }

  updatePosition() {
    this.particleEmitter.setFromAndToPositions(this.from.position, this.to.position);
  }

  disposeSubscriptions() {}

  dispose() {
    super.dispose();

    this.subscriber.dispose();
    this.subscriber = null;

    this.particleEmitter.dispose();
    this.particleEmitter = null;

    this.serviceLocatorUid = null;
    this.from = null;
    this.to = null;
  }
}

export function createConnectionId(from, to) {
  return `${from.id}-to-${to.id}`;
}
