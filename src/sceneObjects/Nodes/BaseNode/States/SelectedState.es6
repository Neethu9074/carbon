'use strict';

import State from '../../../../State';


export default class SelectedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.setHighlight();
    this.owner.selectNode();
  }

  leave() {
    this.owner.clearHighlight();
    this.owner.clearNode();
  }
}
