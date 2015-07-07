'use strict';

import State from '../../../../State';

export default class HighlightedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();

    this.owner.setupConnections();
    this.owner.forEachConnection((c) => c.show());
  }

  leave() {
    this.owner.clearHighlight();

    this.owner.forEachConnection((c) => c.hide());
  }
}
