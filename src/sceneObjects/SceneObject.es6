'use strict';

import THREE from 'three';


const stateLUT = {
  lut: [
    //mouseOver, selected, active
    [[false, false, false], 'inactive'],
    [[false, false, true], 'inital'],
    [[false, true, false], 'inactive'],
    [[false, true, true], 'selected'],
    [[true, false, false], 'inactive'],
    [[true, false, true], 'highlighted'],
    [[true, true, false], 'inactive'],
    [[true, true, true], 'selected']
  ],

  getStateFromLut({mouseOver, selected, active, states}) {
    for (let i = 0; i < this.lut.length; i++) {
      const entry = this.lut[i];
      if(mouseOver === entry[0][0] && selected === entry[0][1] && active === entry[0][2]) {
        const match = entry[1];
        switch (match) {
          case 'inactive':
            return states.inactive;
          case 'selected':
            return states.selected;
          case 'highlighted':
            return states.highlighted;
          default:
            return states.initial;
        }
      }
    }
  }
};

export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3()}) {
    this.position = pos.clone();
    this.parent = parent;
    this.subscriptions = [];
    this.hidden = false;

    this.screenPositionAnchor = this.position.clone();
    this.screenPosition = {x: 0, y: 0};

    this.stateLookUpTable = stateLUT;
    this.states = this.initStates();
    this.stateProperties = {
      mouseOver: false,
      selected: false,
      active: true
    };
    this.stateTemp = this.states.initial;
    this.stateTemp.enter();
  }

  changeStateProperty(name, value) {
    this.stateProperties[name] = value;
    this.updateState();
  }

  updateState() {
    const props = this.stateProperties;
    const oldState = this.stateTemp;
    const newState = stateLUT.getStateFromLut({
      mouseOver: props.mouseOver,
      selected: props.selected,
      active: props.active,
      states: this.states
    });

    if(oldState !== newState) {
      oldState.leave();
      this.stateTemp = newState;
      newState.enter();
    }
  }

  initStates() {
    return {initial: {enter() {}}};
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

  getScene() {
    return this.parent.getScene();
  }

  getAllMapNodes() {
    return this.parent.getAllMapNodes();
  }

  findNodeBySnapshot(snapshot) {
    return this.parent.findNodeBySnapshot(snapshot);
  }

  getHtmlContainer() {
    return this.parent.getHtmlContainer();
  }

  isAnySnapshotSelected() {
    return this.parent.isAnySnapshotSelected();
  }

  on(event, cb) {
    return this.parent.on(event, cb);
  }

  //each object can tell that the scene should be redrawn
  renderScene() {
    this.parent.renderScene();
  }

  //hides the visual representation and pauses all live data streaming
  hide() {
    this.hidden = true;
    console.log('hide');
  }

  //show the visual representation and continues all live data streaming
  show() {
    this.hidden = false;
    console.log('show');
  }

  onHighlight(/*value*/) {}

  updateScreenPosition() {
    const scene = this.getScene();
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
    const scene = this.getScene();

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
      subscription = null;
    });
    this.subscriptions = [];
  }

  removeChild() {}
}
