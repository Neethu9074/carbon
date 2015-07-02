'use strict';

import State from '../../../State';

export default class HighlightedState extends State {

  constructor(ground) {
    super(ground);
  }

  enter() {
  }

  leave() {
  }

  getNext({highlighted}) {
    if(highlighted === false) {
      return this.owner.states.initial;
    }
    return undefined;
  }
}
