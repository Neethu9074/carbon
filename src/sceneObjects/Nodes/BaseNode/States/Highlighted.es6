'use strict';

import State from '../../../../State';

export default class Highlighted extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();
  }

  leave() {
    this.owner.clearHighlight();
  }

  getNext({highlighted, onClick}) {
    if(onClick) {
      return this.owner.states.selected;
    } else if(!highlighted) {
      return this.owner.states.initial;
    }
    return undefined;
  }
}
