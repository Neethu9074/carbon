'use strict';

import State from './State';

export default class InitialState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onInitialEnter();
  }

  leave() {
    this.owner.onInitialLeave();
  }
}
