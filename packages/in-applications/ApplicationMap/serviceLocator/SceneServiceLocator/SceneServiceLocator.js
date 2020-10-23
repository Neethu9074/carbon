import createNullService from 'in-applications/ApplicationMap/serviceLocator/SceneServiceLocator/NullService';
import BaseServiceLocator from 'in-applications/ApplicationMap/serviceLocator/BaseServiceLocator';

export default class SceneServiceLocator extends BaseServiceLocator {
  constructor() {
    super(createNullService);
  }

  getScene() {
    return this.service.getScene();
  }
}
