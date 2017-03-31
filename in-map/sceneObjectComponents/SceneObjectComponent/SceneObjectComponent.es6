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

  // helper methods
  changeXYZOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  changeRGBOf(object, r, g, b) {
    object.r = r;
    object.g = g;
    object.b = b;
  }

  disposeEvents() {
    super.dispose();
  }

  dispose() {
    this.sceneObject = null;
  }
}
