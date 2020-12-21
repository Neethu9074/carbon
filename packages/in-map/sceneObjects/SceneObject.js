import { createLogger } from '@instana/logger';
import RoEmitter from '@instana/roemitter';

import TransformationComponent from 'in-map/sceneObjectComponents/TransformationComponent';
import HighlightingComponent from 'in-map/sceneObjectComponents/HighlightingComponent';
import ColorComponent from 'in-map/sceneObjectComponents/ColorComponent';
import { sceneObjects } from 'in-map/stores/focusableSceneObjectsStore';
import { init as initCursorService } from 'in-map/services/cursor';
import Subscriber from 'in-map/misc/Subscriber';

const logger = createLogger('in-map-sceneObject');

export default class SceneObject extends Subscriber {
  constructor(params) {
    super();

    this.id = params.id;
    this.entity = params.entity;

    this.components = new Map();
    this.defaultColor = params.defaultColor;
    this.eventEmitter = new RoEmitter(this.id);
  }

  init() {
    initCursorService();
  }

  initComponents() {
    this.addComponent('transform', new TransformationComponent(this));

    this.addComponent('color', new ColorComponent(this, this.defaultColor));

    this.addComponent('highlighting', new HighlightingComponent(this));
  }

  initEvents() {}

  initialized() {
    sceneObjects.add(this.id, this);
  }

  afterUpdateEntities() {}

  updateSnapshotAndHealthComponent(params) {
    this.entity = params.entity;
    const snapshotComponent = this.getComponent('snapshot');
    if (snapshotComponent) {
      snapshotComponent.refreshSnapshotSubscription();
    }
    const healthComponent = this.getComponent('health');
    if (healthComponent) {
      healthComponent.refreshHealthSubscription();
    }
  }

  getComponent(id) {
    return this.components.get(id);
  }

  addComponent(id, component) {
    if (__DEV__) {
      if (this.components.has(id)) {
        logger.warn('there is also a component defined with id:', id);
      }
    }
    component.init();
    component.initEvents();
    this.components.set(id, component);
  }

  removeComponent(id) {
    const component = this.components.get(id);
    if (component) {
      component.disposeEvents();
      component.dispose();
      this.components.delete(id);
    }
  }

  getPosition() {
    const transformComponent = this.getComponent('transform');
    return transformComponent ? transformComponent.getPosition() : null;
  }

  getFocusPosition() {
    return this.getPosition();
  }

  disposeEvents() {
    super.dispose();
  }

  dispose() {
    sceneObjects.remove(this.id);

    this.components.forEach(component => {
      component.disposeEvents();
      component.dispose();
    });
    this.components.clear();

    this.eventEmitter.dispose();
    this.eventEmitter = null;
  }
}
