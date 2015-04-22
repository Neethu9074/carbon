'use strict';

import SceneObject from './SceneObject';

export default class Host extends SceneObject {

  constructor({area}) {
    super({parent: area});
  }
}
