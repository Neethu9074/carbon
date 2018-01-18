import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import ParticleEmitter from 'in-components/FlowMap/misc/ParticleEmitter';
import SceneObject from 'in-components/FlowMap/sceneObjects/SceneObject';

export default class Connection extends SceneObject {
  constructor(serviceLocatorUid, from, to) {
    super(createConnectionId(from, to), serviceLocatorUid);

    this.serviceLocatorUid = serviceLocatorUid;
    this.from = from;
    this.to = to;
    this.particleEmitter = new ParticleEmitter(serviceLocatorUid);
  }

  setFromAndToPositions(fromPosition, toPosition) {
    this.particleEmitter.setFromAndToPositions(fromPosition, toPosition);

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.addOrSet(this.id, [
      fromPosition.x,
      fromPosition.y,
      fromPosition.z,
      toPosition.x,
      toPosition.y,
      toPosition.z
    ]);
  }

  dispose() {
    super.dispose();

    getServiceLocators(this.serviceLocatorUid).connectionsServiceLocator.remove(this.id);

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
