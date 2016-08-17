import RoEmitter from 'roemitter';

import TransformationComponent from 'in-map/sceneObjectComponents/TransformationComponent';
import focusableSceneObjects from 'in-map/stores/focusableSceneObjectsStore';
import ColorComponent from 'in-map/sceneObjectComponents/ColorComponent';
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
    this.addComponent('transform', new TransformationComponent(this));

    this.addComponent('color', new ColorComponent(this));
  }

  initEvents() {}

  initialized() {
    focusableSceneObjects.add(this.id, this);
  }

  getComponent(id) {
    if (!this.components) {
      return undefined;
    }
    return this.components[id];
  }

  addComponent(id, component) {
    component.init();
    component.initEvents();
    this.components[id] = component;
  }

  removeComponent(id) {
    const component = this.components[id];
    if (component) {
      component.disposeEvents();
      component.dispose();
      delete this.components[id];
    }
  }

  getFocusPosition() {
    return this.getComponent('transform').getPosition();
  }

  disposeEvents() {
    super.dispose();
  }

  dispose() {
    focusableSceneObjects.remove(this.id);

    Object.keys(this.components).forEach(key => {
      this.removeComponent(key);
    });
    this.components = null;

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
