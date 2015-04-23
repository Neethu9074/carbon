'use strict';

import SceneObject from './SceneObject';

export default class Host extends SceneObject {

  constructor({zone}) {
    super({parent: zone});
  }
}
