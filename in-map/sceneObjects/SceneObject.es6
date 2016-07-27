export default class SceneObject {

  constructor(parentComponent) {
    this.parentComponent = parentComponent;
  }

  init() {}

  initEvents() {}

  dispose() {
    this.parentComponent = null;
  }
}
