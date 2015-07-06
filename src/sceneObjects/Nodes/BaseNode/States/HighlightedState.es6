'use strict';

import State from '../../../../State';

export default class HighlightedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();
  }

  leave() {
    this.owner.clearHighlight();
  }
}
