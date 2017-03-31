import { setScene, clear as clearSceneStore } from 'in-map/stores/sceneStore';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import { createEventBus } from 'in-map/services/eventBus';

export default class EmptyScene extends SceneObject {
  constructor(params) {
    super(params);

    // clears the old one and fires up a new to remove all stored messages
    createEventBus();

    this.isEmptyScene = true;
  }

  init() {
    super.init();
    setScene(this);
  }

  initEvents() {
    super.initEvents();
  }

  dispose() {
    clearSceneStore();
  }
}
