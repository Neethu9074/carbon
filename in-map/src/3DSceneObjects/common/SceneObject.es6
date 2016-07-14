import RoEmitter from 'roemitter';

import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import {currentTooltip, tooltipForSceneObject} from 'in-map/src/mapStores';
import {longClickedSceneObject} from 'in-map/src/mapStores';
import {eventBus} from 'in-map/src/services/eventBus';
import {scene$} from 'in-map/src/stores/sceneStore';
import Subscriber from 'in-map/src/Subscriber';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import PositionComponent from '../../components/common/PositionComponent';
import {StateMachine} from '../../StateMachine/StateMachine';


export default class SceneObject extends Subscriber {

  constructor({parent, id}) {
    super();

    this.id = id;
    this.parent = parent;

    this.eventEmitter = new RoEmitter(id);
    this.addSubscription(scene$.subscribe(scene => this.scene = scene));

    this.stateMachine = new StateMachine(this);

    this.initComponents();
    this.init();

    this.stateMachine.initialized();

    this.addSubscriptions([
      selectedSnapshotIdForHighlightingInMap.subscribe(selectedId => {
        const isThisSelected = selectedId === this.id;
        if (isThisSelected) {
          this.stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.ON);
        } else if (!isThisSelected && this.isSelected()) {
          this.stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.OFF);
        }
      }),

      tooltipForSceneObject.subscribe(sOId => {
        if (sOId === this.id) {
          currentTooltip.emit(this.getTooltip());
        }
      }),

      longClickedSceneObject.subscribe(so => {
        if (so && so.id === this.id) {
          eventBus.emit('openDashboard', this.id);
          longClickedSceneObject.emit(null);
        }
      })
    ]);
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

  getFactory(name) {
    return this.parent.getFactory(name);
  }

  forEachComponent(fn) {
    Object.keys(this.components).forEach(key => fn(this.components[key]));
  }

  changeComponentState(componentName, stateProperty, value) {
    this.components[componentName].stateMachine.changeStateProperty(stateProperty, value);
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

  addCollisionObject(obj, layer) {
    this.scene.addCollisionObject(obj, layer);
  }

  removeCollisionObject(obj, layer) {
    this.scene.removeCollisionObject(obj, layer);
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

  onZoomLevel() {
    return this.parent.onZoomLevel();
  }

  removeChild() {}

  dispose() {
    super.dispose();

    // reset states so that inactive state is taken
    this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty(PROPERTIES.SELECTED, PROPERTY_VALUES.OFF);
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    this.forEachComponent(component => component.dispose());

    this.eventEmitter.dispose();
    this.eventEmitter = null;

    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
