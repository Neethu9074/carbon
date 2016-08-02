import RoEmitter from 'roemitter';

import TransformationComponent from 'in-map/sceneObjectComponents/TransformationComponent';
import Subscriber from 'in-map/misc/Subscriber';


export default class SceneObject extends Subscriber {

  constructor(id) {
    super();

    this.id = id;
    this.components = {};
    this.eventEmitter = new RoEmitter(this.id);
  }

  init() {}

  initComponents() {
    this.components.transform = new TransformationComponent(this);
  }

  initEvents() {}

  getComponent(id) {
    if (!this.components) {
      return undefined;
    }
    return this.components[id];
  }

  addComponent(id, component) {
    this.components[id] = component;
  }

  disposeEvents() {
    super.dispose();
  }

  dispose() {
    Object.keys(this.components).forEach(key => {
      this.components[key].dispose();
    });
    this.components = null;

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
