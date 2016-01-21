export default class BaseModule {

  constructor(parent) {
    this.parent = parent;
  }

  dispose() {
    this.parent = null;
  }
}
