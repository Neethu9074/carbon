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

  getNext({highlighted}) {
    if(highlighted) {
      return this.owner.states.highlighted;
    }
    return undefined;
  }
}
