import RoEmitter from 'roemitter';

import * as snapshotStore from 'in-stores/snapshot';
import Subscriber from 'in-map/src/Subscriber';

import {currentScene} from 'in-map/src/stores';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import PositionComponent from '../../components/common/PositionComponent';
import {StateMachine} from '../../StateMachine/StateMachine';


export default class SceneObject extends Subscriber {

  constructor({parent, id}) {
    super();

    this.id = id;
    this.parent = parent;

    this.eventEmitter = new RoEmitter(id);
    this.addSubscription(currentScene.subscribe(scene => this.scene = scene));

    this.initComponents();

    this.screenPositionAnchor = this.getComponent('position').getPosition().clone();
    this.screenPosition = {x: 0, y: 0};

    this.init();

    this.stateMachine = new StateMachine(this);
    this.stateMachine.initialized();

    this.addSubscription(snapshotStore.selectedSnapshotId.subscribe(selectedId => {
      const isSelected = (selectedId === this.id) ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty(PROPERTIES.SELECTED, isSelected);
    }));
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  initComponents() {
    this.components = {
      position: new PositionComponent({sceneObject: this})
    };
  }

  init() {}

  getComponent(name) {
    return this.components[name];
  }

  forEachComponent(fn) {
    Object.keys(this.components).forEach(key => fn(this.components[key]));
  }

  onInitialEnter() {}
  onInitialLeave() {}
  onHighlightEnter() {}
  onHighlightLeave() {}
  onSelectedEnter() {}
  onSelectedLeave() {}
  onSelectedHighlightEnter() {}
  onSelectedHighlightLeave() {}
  onIndirectHighlightEnter() {}
  onIndirectHighlightLeave() {}

  onInactiveEnter() {
    this.forEachComponent(component =>
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF));
  }

  onInactiveLeave() {
    this.forEachComponent(component =>
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON));
  }

  isSelected() {
    return this.stateMachine.stateProperties.selected === PROPERTY_VALUES.ON;
  }

  isHighlighted() {
    return this.stateMachine.stateProperties.highlight === PROPERTY_VALUES.ON;
  }

  isActive() {
    return this.stateMachine.stateProperties.active === PROPERTY_VALUES.ON;
  }

  setScreenPositionAnchor(x, y, z) {
    this.screenPositionAnchor.set(x, y, z);
  }

  addSceneObject(obj) {
    this.scene.addSceneObject(obj);
  }

  removeSceneObject(obj) {
    this.scene.removeSceneObject(obj);
  }

  addCollisionObject(obj, layer) {
    this.scene.addCollisionObject(obj, layer);
  }

  removeCollisionObject(obj, layer) {
    this.scene.removeCollisionObject(obj, layer);
  }

  // each object can tell that the scene should be redrawn
  renderScene() {
    this.scene.renderScene();
  }

  getAllNodes() {
    return this.parent.getAllNodes();
  }

  findNodeById(id) {
    return this.parent.findNodeById(id);
  }

  getHtmlContainer() {
    return this.scene.getHtmlContainer();
  }

  updateScreenPosition() {
    const scene = this.scene;
    if (scene.mapHandler) {
      const camera = scene.mapHandler.getCurrentCamera();
      if (!camera) {
        return;
      }

      const width = scene.width;
      const height = scene.height;
      const screenPosition = this.screenPositionAnchor
      .clone()
      .applyProjection(camera.projection);

      screenPosition.x = (screenPosition.x + 1) / 2 * width;
      screenPosition.y = -(screenPosition.y - 1) / 2 * height;

      this.screenPosition.x = screenPosition.x;
      this.screenPosition.y = screenPosition.y;
    }
  }

  isInView() {
    const screenPos = this.screenPosition;
    const scene = this.scene;

    return (screenPos.x > 0 && screenPos.x <= scene.width &&
            screenPos.y > 0 && screenPos.y <= scene.height);
  }

  removeChild() {}

  dispose() {
    this.eventEmitter.dispose();
    this.eventEmitter = null;

    super.dispose();

    // reset states so that inactive state is taken
    this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    this.forEachComponent(component => component.dispose());

    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
