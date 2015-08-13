import PositionComponent from '../../components/PositionComponent';

import {currentScene} from '../../stores/mapStore';
import {setupStates} from './States/index';

/*eslint-disable no-multi-spaces*/
const stateLUT = [
  //mouseOver,  selected,   active  hidden    result state
  [[false,      false,      true,   false],   'initial'],
  [[false,      true,       true,   false],   'selected'],
  [[true,       false,      true,   false],   'highlighted'],
  [[true,       true,       true,   false],   'selectedHighlighted'],
  [[false,      true,       false,  false],   'selectedInactive'],
  [[true,       false,      false,  false],   'highlightedInactive'],
  [[true,       true,       false,  false],   'selectedHighlightedInactive'],
  [[false,      false,      false,  false],   'inactive'],
  [[false,      false,      true,   true],    'hidden'],
  [[false,      true,       true,   true],    'hidden'],
  [[true,       false,      true,   true],    'hidden'],
  [[true,       true,       true,   true],    'hidden'],
  [[false,      true,       false,  true],    'hidden'],
  [[true,       false,      false,  true],    'hidden'],
  [[true,       true,       false,  true],    'hidden'],
  [[false,      false,      false,  true],    'hidden']
];
/*eslint-enable no-multi-spaces*/

class StateMachine {

  constructor(states) {
    this.stateLookUpTable = stateLUT;
    this.states = states;
    this.stateProperties = {
      mouseOver: false,
      selected: false,
      active: true,
      hidden: false
    };
    this.state = this.states.initial;
  }

  getStateFromLut({mouseOver, selected, active, hidden, states}) {
    for (let i = 0; i < stateLUT.length; i++) {
      const entry = stateLUT[i];
      if(mouseOver === entry[0][0] &&
         selected === entry[0][1] &&
         active === entry[0][2] &&
         hidden === entry[0][3]
      ) {
        return states[entry[1]];
      }
    }
  }

  changeStateProperty(name, value) {
    if(this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }

  updateState() {
    const props = this.stateProperties;
    const oldState = this.state;
    const newState = this.getStateFromLut({
      mouseOver: props.mouseOver,
      selected: props.selected,
      active: props.active,
      hidden: props.hidden,
      states: this.states
    });

    if(oldState !== newState) {
      oldState.leave();
      this.state = newState;
      newState.enter();
    }
  }

  getLookUpTable() {
    return stateLUT;
  }
}

export default class SceneObject {
  constructor({parent, id}) {
    this.parent = parent;
    this.id = id;
    this.subscriptions = [];

    this.addSubscription(currentScene.subscribe((scene) => {
      this.scene = scene;
    }));

    this.initComponents();

    this.screenPositionAnchor = this.getComponent('position').getPosition().clone();
    this.screenPosition = {x: 0, y: 0};

    this.init();

    this.stateMachine = new StateMachine(setupStates(this));
    this.stateMachine.state.enter();
  }

  initComponents() {
    this.components = {
      position: new PositionComponent({sceneObject: this})
    };
  }

  getComponent(name) {
    return this.components[name];
  }

  forEachComponent(fn) {
    Object.keys(this.components).forEach(key => fn(this.components[key]));
  }

  init() {}

  reEnterState() {
    this.stateMachine.state.leave();
    this.stateMachine.state.enter();
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
  onHighlightInactiveEnter() {}
  onHighlightInactiveLeave() {}
  onSelectedInactiveEnter() { this.onInactiveEnter(); }
  onSelectedInactiveLeave() { this.onInactiveLeave(); }

  onInactiveEnter() {
    this.forEachComponent((component) =>
      component.stateMachine.changeStateProperty('active', false));
  }

  onInactiveLeave() {
    this.forEachComponent((component) =>
      component.stateMachine.changeStateProperty('active', true));
  }

  onHiddenEnter() {
    this.forEachComponent((component) =>
      component.stateMachine.changeStateProperty('active', false));
  }

  onHiddenLeave() {
    this.forEachComponent((component) =>
      component.stateMachine.changeStateProperty('active', true));
  }

  isSelected() {
    return this.stateMachine.stateProperties.selected;
  }

  isHighlighted() {
    return this.stateMachine.stateProperties.mouseOver;
  }

  isActive() {
    return this.stateMachine.stateProperties.active;
  }

  isHidden() {
    return this.stateMachine.stateProperties.hidden;
  }

  show() {
    this.stateMachine.changeStateProperty('hidden', false);
  }

  hide() {
    this.stateMachine.changeStateProperty('hidden', true);
  }

  positionChanged() {throw new Error('NOT IMPLEMENTED'); }

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

  //each object can tell that the scene should be redrawn
  renderScene() {
    this.scene.renderScene();
  }

  colorChanged() {}

  //this method is introduced to get a better handling of the hole merged
  //geometry / factory stuff. each specific sceneObject should implement it and
  //and do all update stuff here.
  updateOfVisualComponents() {throw new Error('NOT IMPLEMENTED'); }

  getAllMapNodes() {
    return this.parent.getAllMapNodes();
  }

  findNodeBySnapshot(snapshot) {
    return this.parent.findNodeBySnapshot(snapshot);
  }

  getHtmlContainer() {
    return this.scene.getHtmlContainer();
  }

  on(event, cb) {
    return this.parent.on(event, cb);
  }

  onHighlight(highlighted) {
    this.stateMachine.changeStateProperty('mouseOver', highlighted);
  }

  updateScreenPosition() {
    const scene = this.scene;
    const camera = scene.camera;
    const width = scene.width;
    const height = scene.height;
    const screenPosition = this.screenPositionAnchor
      .clone()
      .project(camera);

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
    //dispose subscriptions first so that no update fires into disposed component
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];

    //reset states so that inactive state is taken
    this.stateMachine.changeStateProperty('mouseOver', false);
    this.stateMachine.changeStateProperty('selected', false);
    this.stateMachine.changeStateProperty('active', false);

    this.forEachComponent(component => component.dispose());

    if(this.parent) {
      this.parent.removeChild(this);
    }
  }
}
