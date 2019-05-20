import createNullService from 'in-components/FlowMap/serviceLocator/SceneServiceLocator/NullService';
import BaseServiceLocator from 'in-components/FlowMap/serviceLocator/BaseServiceLocator';

export default class SceneServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  getScene() {
    return this.service.getScene();
  }
}
