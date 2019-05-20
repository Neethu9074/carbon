import createNullService from 'in-new-components/ApplicationMap/serviceLocator/SceneServiceLocator/NullService';
import BaseServiceLocator from 'in-new-components/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class SceneServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  getScene() {
    return this.service.getScene();
  }
}
