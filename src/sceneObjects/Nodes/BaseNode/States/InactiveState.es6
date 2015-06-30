'use strict';

import State from '../../../../State';

export default class InactiveState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {}

  leave() {}

  getNext({inactive, highlighted}) {
    if(inactive === false) {
      if(highlighted) {
        return this.owner.states.highlighted;
      } else {
        return this.owner.states.initial;
      }
    }
    return undefined;
  }
}
