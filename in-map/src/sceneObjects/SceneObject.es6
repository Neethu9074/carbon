import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';

import PositionComponent from '../components/PositionComponent';
import {PROPERTY_VALUES} from '../StateMachine/StateMachine';
import {StateMachine} from '../StateMachine/StateMachine';

import {currentScene} from '../mapStores';

export default class SceneObject {

  constructor({parent, id}) {
    this.parent = parent;
    this.id = id;
    this.subscriptions = [];

    this.addSubscription(currentScene.subscribe(scene => this.scene = scene));

    this.initComponents();

    this.screenPositionAnchor = this.getComponent('position').getPosition().clone();
    this.screenPosition = {x: 0, y: 0};

    this.init();

    this.stateMachine = new StateMachine(this);
    this.stateMachine.initialized();

    this.addSubscription(selectedSnapshot.selectedEntityId.subscribe(selectedId => {
      const isSelected = (selectedId === this.id) ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      this.stateMachine.changeStateProperty('selected', isSelected);
    }));
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
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
  onSelectedHighlightInactiveEnter() {}
  onSelectedHighlightInactiveLeave() {}
  onIndirectHighlightEnter() {}
  onIndirectHighlightLeave() {}
  onHighlightInactiveEnter() {}
  onHighlightInactiveLeave() {}
  onSelectedInactiveEnter() { this.onInactiveEnter(); }
  onSelectedInactiveLeave() { this.onInactiveLeave(); }

  onInactiveEnter() {
    this.forEachComponent(component => component.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF));
  }

  onInactiveLeave() {
    this.forEachComponent(component => component.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON));
  }

  onHiddenEnter() {
    this.forEachComponent(component => component.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF));
  }

  onHiddenLeave() {
    this.forEachComponent(component => component.setStartingStateProperties());
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

  isHidden() {
    return this.stateMachine.stateProperties.hidden === PROPERTY_VALUES.ON;
  }

  show() {
    this.stateMachine.changeStateProperty('hidden', PROPERTY_VALUES.OFF);
  }

  hide() {
    this.stateMachine.changeStateProperty('hidden', PROPERTY_VALUES.ON);
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

  addSubscription(subscription) {
    this.subscriptions.push(subscription);
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

  onHighlight(highlighted) {
    const value =  highlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.stateMachine.changeStateProperty('highlight', value);
  }

  updateScreenPosition() {
    const scene = this.scene;
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

  isInView() {
    const screenPos = this.screenPosition;
    const scene = this.scene;

    return (screenPos.x > 0 && screenPos.x <= scene.width &&
      screenPos.y > 0 && screenPos.y <= scene.height);
  }

  removeChild() {}

  dispose() {
    // dispose subscriptions first so that no update fires into disposed component
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];

    // reset states so that inactive state is taken
    this.stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    this.forEachComponent(component => component.dispose());

    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
