'use strict';

import State from '../../../../State';


export default class Initial extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
  }

  leave() {
  }

  getNext({highlighted}) {
    if(highlighted) {
      return this.owner.states.highlighted;
    }
    return undefined;
  }
}
