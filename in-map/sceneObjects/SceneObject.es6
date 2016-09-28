import {createLogger} from 'instalog';
import RoEmitter from 'roemitter';

import TransformationComponent from 'in-map/sceneObjectComponents/TransformationComponent';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import ColorComponent from 'in-map/sceneObjectComponents/ColorComponent';
import {sceneObjects} from 'in-map/stores/focusableSceneObjectsStore';
import {init as initCursorService} from 'in-map/services/cursor';
import Subscriber from 'in-map/misc/Subscriber';


const logger = createLogger('in-map-sceneObject');

export default class SceneObject extends Subscriber {

  constructor(params) {
    super();

    this.id = params.id;

    this.components = {};
    this.eventEmitter = new RoEmitter(this.id);
  }

  init() {
    initCursorService();
  }

  initComponents() {
    this.addComponent('transform', new TransformationComponent(this));

    this.addComponent('color', new ColorComponent(this));

    this.addComponent('highlighting', new HighlightingComponent(this));
  }

  initEvents() {}

  initialized() {
    sceneObjects.add(this.id, this);
  }

  getComponent(id) {
    if (!this.components) {
      return undefined;
    }
    return this.components[id];
  }

  addComponent(id, component) {
    if (__DEV__) {
      if (this.components[id]) {
        logger.warn('there is also a component defined with id:', id);
      }
    }
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
    sceneObjects.remove(this.id);

    Object.keys(this.components).forEach(key => {
      this.removeComponent(key);
    });
    this.components = null;

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
