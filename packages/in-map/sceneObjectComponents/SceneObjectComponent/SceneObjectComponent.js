/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Subscriber from 'in-map/misc/Subscriber';

let idCounter = 0;

export default class SceneObjectComponent extends Subscriber {
  constructor(sceneObject, postId) {
    super();

    this.id = sceneObject.id + postId + '_' + idCounter++;
    this.sceneObject = sceneObject;
  }

  init() {}
  initEvents() {}

  emitToClient(msg, payload) {
    this.sceneObject.eventEmitter.emit(msg, payload);
  }

  disposeEvents() {
    super.dispose();
  }

  dispose() {
    this.sceneObject = null;
  }
}
