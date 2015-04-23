'use strict';

import SceneObject from './SceneObject';

export default class Zone extends SceneObject {

  constructor({parent, id}) {
    super({parent});
    this.id = id;
  }

  addHost(/*host*/) {
    // TODO
  }
}
