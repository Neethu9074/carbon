'use strict';

import State from '../../../State';


export default class Initial extends State {

  constructor(ground) {
    super(ground);
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
