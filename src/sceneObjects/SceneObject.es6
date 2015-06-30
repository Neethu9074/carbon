'use strict';

import THREE from 'three';


export default class SceneObject {

  constructor({parent, pos = new THREE.Vector3()}) {
    this.position = pos.clone();
    this.parent = parent;
    this.subscriptions = [];

    this.screenPositionAnchor = this.position.clone();
    this.screenPosition = {x: 0, y: 0};

    this.states = this.initStates();
    this.state = this.states.initial;
    this.state.enter();
  }

  initStates() {
    return {initial: {enter() {}}};
  }

  switchStateIfNext(action) {
    const next = this.state.getNext(action);
    if(next){
      this.state.leave();
      this.state = next;
      this.state.enter();
      this.getScene().renderScene();
    }
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
  }

  //show the visual representation and continues all live data streaming
  show() {
    this.hidden = false;
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
