'use strict';

import State from '../../../../State';


export default class SelectedState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.selected();
  }

  leave() {
    this.owner.unSelected();
  }
}
