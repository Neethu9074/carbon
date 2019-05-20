import FlowMapBaseEntity from 'in-components/FlowMap/sceneObjects/FlowMapBaseEntity';

export default class Child extends FlowMapBaseEntity {
  constructor(parentNode, id) {
    super(parentNode.serviceLocatorUid, id);

    this.parentNode = parentNode;

    this.initSubscriptions();
  }
}
