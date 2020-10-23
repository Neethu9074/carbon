import ParticleEmitter from 'in-applications/FlowMap/misc/ParticleEmitter';
import SceneObject from 'in-applications/FlowMap/sceneObjects/SceneObject';
import Subscriber from 'in-map/misc/Subscriber';

export default class Connection extends SceneObject {
  constructor(serviceLocatorUid, from, to, direction, connectionService) {
    super(createConnectionId(from, to), serviceLocatorUid);

    this.serviceLocatorUid = serviceLocatorUid;
    this.from = from;
    this.to = to;
    this.direction = direction;

    this.particleEmitter = new ParticleEmitter(direction === 'incoming' ? from : to, serviceLocatorUid);

    this.initStartSubscriptions(connectionService);
  }

  initStartSubscriptions(connectionService) {
    this.subscriber = new Subscriber();
    this.subscriber.addSubscription(
      this.from.events$.on('heatMapColor').subscribe(() => connectionService.requestConnectionColorUpdate())
    );
  }

  setFromAndTo(from, to) {
    this.from = from;
    this.to = to;
  }

  getDirection() {
    return this.direction;
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
