'use strict';

import State from '../../../../State';


export default class InitialState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
  }

  leave() {
  }

  getNext({highlighted, inactive}) {
    if(highlighted) {
      return this.owner.states.highlighted;
    } else if(inactive) {
      return this.owner.states.inactive;
    }
    return undefined;
  }
}
