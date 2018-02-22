import ParticleEmitter from 'in-components/FlowMap/misc/ParticleEmitter';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';

export default class Connection extends SceneObject {
  constructor(serviceLocatorUid, from, to) {
    super(createConnectionId(from, to), serviceLocatorUid);

    this.serviceLocatorUid = serviceLocatorUid;
    this.from = from;
    this.to = to;
    this.particleEmitter = new ParticleEmitter(from, serviceLocatorUid);
  }

  setFromAndToPositions(fromPosition, toPosition) {
    this.particleEmitter.setFromAndToPositions(fromPosition, toPosition);
  }

  updatePosition() {
    this.setFromAndToPositions(this.from.position, this.to.position);
  }

  dispose() {
    super.dispose();

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
