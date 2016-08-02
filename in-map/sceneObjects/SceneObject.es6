import RoEmitter from 'roemitter';

import TransformationComponent from 'in-map/sceneObjectComponents/TransformationComponent';
import Subscriber from 'in-map/misc/Subscriber';


export default class SceneObject extends Subscriber {

  constructor(id) {
    super();

    this.id = id;
    console.log('create', id);

    this.components = {};

    this.eventEmitter = new RoEmitter(this.id);
  }

  init() {
    console.log('init', this.id);
  }

  initComponents() {
    this.components.transform = new TransformationComponent(this);
  }

  initEvents() {
    console.log('initEvents', this.id);
  }

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
    console.log('disposeEvents', this.id);

    super.dispose();
  }

  dispose() {
    console.log('dispose', this.id);

    Object.keys(this.components).forEach(key => {
      this.components[key].dispose();
    });
    this.components = null;

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
