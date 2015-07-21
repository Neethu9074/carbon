'use strict';

import THREE from 'three';
import {setupStates} from './States/index';
import {currentScene} from '../../stores/mapStore';
import {createLogger} from 'instalog';

const logger = createLogger('ui-map.sceneObject');

const stateLUT = {
/*eslint-disable no-multi-spaces*/
  lut: [
    //mouseOver,  selected,   active  hidden    result state
    [[false,      false,      true,   false],   'initial'],
    [[false,      true,       true,   false],   'selected'],
    [[true,       false,      true,   false],   'highlighted'],
    [[true,       true,       true,   false],   'selected'],
    [[false,      true,       false,  false],   'inactive'],
    [[true,       false,      false,  false],   'inactive'],
    [[true,       true,       false,  false],   'inactive'],
    [[false,      false,      false,  false],   'inactive'],
    [[false,      false,      true,   true],    'hidden'],
    [[false,      true,       true,   true],    'hidden'],
    [[true,       false,      true,   true],    'hidden'],
    [[true,       true,       true,   true],    'hidden'],
    [[false,      true,       false,  true],    'hidden'],
    [[true,       false,      false,  true],    'hidden'],
    [[true,       true,       false,  true],    'hidden'],
    [[false,      false,      false,  true],    'hidden']
  ],
/*eslint-enable no-multi-spaces*/

  getStateFromLut({mouseOver, selected, active, hidden, states}) {
    for (let i = 0; i < this.lut.length; i++) {
      const entry = this.lut[i];
      if(mouseOver === entry[0][0] &&
         selected === entry[0][1] &&
         active === entry[0][2] &&
         hidden === entry[0][3]
      ) {
        const match = entry[1];
        let state;
        switch (match) {
          case 'inactive':
            state = states.inactive;
            break;
          case 'selected':
            state = states.selected;
            break;
          case 'highlighted':
            state = states.highlighted;
            break;
          case 'hidden':
            state = states.hidden;
            break;
          case 'initial':
            state = states.initial;
            break;
        }
        return state;
      }
    }
  }
};

export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3(0, 0, 0)}) {
    this.position = pos.clone();
    this.parent = parent;
    this.subscriptions = [];
    this.hidden = false;

    this.screenPositionAnchor = this.position.clone();
    this.screenPosition = {x: 0, y: 0};

    this.init();

    this.addSubscription(currentScene.subscribe((scene) => {
      this.scene = scene;
    }));

    this.stateLookUpTable = stateLUT;
    this.states = setupStates(this);
    this.stateProperties = {
      mouseOver: false,
      selected: false,
      active: true,
      hidden: false
    };
    this.state = this.states.initial;
    this.state.enter();
  }

  init() {

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
    const newState = stateLUT.getStateFromLut({
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

      //to show changes on the state, render scene
      this.scene.renderScene();
    }
  }

  reEnterState() {
    this.state.leave();
    this.state.enter();
  }

  onInitialEnter() {logger.debug('on initial enter'); }
  onInitialLeave() {logger.debug('on initial leave'); }
  onHighlightEnter() {logger.debug('on highlight enter'); }
  onHighlightLeave() {logger.debug('on highlight leave'); }
  onSelectedEnter() {logger.debug('on selected enter'); }
  onSelectedLeave() {logger.debug('on selected leave'); }
  onInactiveEnter() {logger.debug('on inactive enter'); }
  onInactiveLeave() {logger.debug('on inactive leave'); }
  onHiddenEnter() {logger.debug('on hidden enter'); }
  onHiddenLeave() {logger.debug('on hidden leave'); }

  isSelected() {
    return this.stateProperties.selected;
  }

  isHighlighted() {
    return this.stateProperties.mouseOver;
  }

  isActive() {
    return this.stateProperties.active;
  }

  isHidden() {
    return this.stateProperties.hidden;
  }

  show() {
    this.changeStateProperty('hidden', false);
  }

  hide() {
    this.changeStateProperty('hidden', true);
  }


  setPosition(x, y, z) {
    this.position.set(x, y, z);
  }

  setScreenPositionAnchor(x, y, z) {
    this.screenPositionAnchor.set(x, y, z);
  }

  getPosition() {
    return this.position;
  }

  addSceneObject(obj) {
    this.parent.addSceneObject(obj);
  }

  removeSceneObject(obj) {
    this.parent.removeSceneObject(obj);
  }

  addCollisionObject(obj, layer) {
    this.parent.addCollisionObject(obj, layer);
  }

  removeCollisionObject(obj, layer) {
    this.parent.removeCollisionObject(obj, layer);
  }

  addSubscription(subscription) {
    this.subscriptions.push(subscription);
  }

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
    return this.parent.getHtmlContainer();
  }

  on(event, cb) {
    return this.parent.on(event, cb);
  }

  //each object can tell that the scene should be redrawn
  renderScene() {
    this.parent.renderScene();
  }

  onHighlight(highlighted) {
    this.changeStateProperty('mouseOver', highlighted);
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

  dispose() {
    this.disposeSubscriptions();

    this.position = null;

    if(this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = null;
  }

  disposeSubscriptions() {
    this.subscriptions.forEach(subscription => {
      subscription.dispose();
    });
    this.subscriptions = [];
  }

  removeChild() {}
}
