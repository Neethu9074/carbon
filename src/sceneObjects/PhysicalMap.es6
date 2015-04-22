'use strict';

import SceneObject from './SceneObject';

export default class PhysicalMap extends SceneObject {

  constructor({scene}) {
    super({parent: null});

    this.scene = scene;
  }
}
